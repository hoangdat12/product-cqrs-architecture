import { BadRequest, InternalServerError } from '../core/error.response';
import ProductFactory from './product.service';
import { IMessage } from '../ultil/interface/message.interface';
import { getProductMappingData } from '../ultil/get-product-mapping';
import { ElasticsearchService } from './els.service';
import { connectToRabbitMq } from '../dbs/init.rabbitmq';

// For Product
const consumerQueue = async () => {
  try {
    const queueName = process.env.RABBITMQ_SYNC_QUEUE;
    if (!queueName) throw new InternalServerError('Queue not found!');
    const { channel } = await connectToRabbitMq();

    await channel.prefetch(10);

    await channel.assertQueue(queueName, {
      durable: false,
    });

    console.log(`Waiting for messages from ${queueName}...`);
    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          // parse Message
          const message = JSON.parse(msg.content.toString()) as IMessage;

          console.log('Receiving message to Sync Data:::: ', message);

          const { messageType, payload } = message;
          const productType = message.payload.product_type;
          const elsData = getProductMappingData(message);

          switch (messageType) {
            case 'Create':
              const elsCreateP = ElasticsearchService.createProduct(elsData);
              const productCreateP = ProductFactory.createProductV2(
                productType,
                payload
              );
              await Promise.all([elsCreateP, productCreateP]);
              break;
            case 'Update':
              const elsUpdateP = ElasticsearchService.updateProduct(elsData);
              const productUpdateP = ProductFactory.updateProductV2(
                productType,
                payload
              );
              await Promise.all([elsUpdateP, productUpdateP]);
              break;
            case 'Delete':
              const elsDeleteP = ElasticsearchService.deleteProduct(
                payload._id
              );
              const productDeleteP = ProductFactory.deleteProductV2(
                productType,
                payload._id
              );
              await Promise.all([elsDeleteP, productDeleteP]);
              break;
            default:
              throw new BadRequest('Message type not found!');
          }

          // acknowlegment
          channel.ack(msg);
        } catch (error) {
          // Mark the message as fail process, need to move DLX
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

export const RabbitMqService = {
  consumerQueue,
};

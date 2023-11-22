import amqp from 'amqplib';
import { BadRequest, InternalServerError } from '../core/error.response';
import ProductFactory from './product.service';
import { IMessage } from '../ultil/interface/message.interface';
import { createProduct } from '../dbs/init.elastic';
import { getProductMappingData } from '../ultil/get-product-mapping';

const connectToRabbitMq = async () => {
  try {
    // const connUrl = `amqp://${process.env.RABBITMQ_USERNAME}
    //     :${process.env.RABBITMQ_PASSWORD}
    //     @${process.env.RABBITMQ_HOST}:5672/`;
    const connUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

    const conn = await amqp.connect(connUrl);
    if (!conn) throw new Error('Connection not Established!');

    const channel = await conn.createChannel();
    return { conn, channel };
  } catch (error) {
    throw error;
  }
};

const connectToRabbitMqForTest = async () => {
  try {
    const { conn, channel } = await connectToRabbitMq();

    // Publish message to a queue
    const queue = 'test-queue';
    const message = 'Test established for RabbitMq successfully!';
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));

    // close the connection
    await conn.close();
  } catch (error) {
    throw error;
  }
};

const consumerQueue = async () => {
  try {
    const queueName = process.env.RABBITMQ_SYNC_QUEUE;
    if (!queueName) throw new InternalServerError('Queue not found!');
    const { channel } = await connectToRabbitMq();

    await channel.assertQueue(queueName, { durable: false });

    console.log(`Waiting for messages from ${queueName}...`);
    channel.consume(
      queueName,
      async (msg) => {
        if (msg) {
          // parse Message
          const message = JSON.parse(msg.content.toString()) as IMessage;
          const { messageType, payload } = message;

          switch (messageType) {
            case 'Create':
              const elsData = getProductMappingData(message);
              createProduct(elsData);
              await ProductFactory.createProductV2(
                message.payload.product_type,
                payload
              );
              break;
            case 'Update':
              return await ProductFactory.updateProductV2(
                message.payload.product_type,
                payload
              );
            case 'Delete':
              return await ProductFactory.deleteProductV2(
                message.payload.product_type,
                payload._id
              );
            default:
              throw new BadRequest('Message type not found!');
          }
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    throw error;
  }
};

// export const consumerFactory = {
//   Create: ProductFactory.createProduct,
//   Update: ProductFactory.updateProduct,
//   Delete: ProductFactory.deleteProduct,
// }

export const RabbitMqService = {
  connectToRabbitMq,
  connectToRabbitMqForTest,
  consumerQueue,
};

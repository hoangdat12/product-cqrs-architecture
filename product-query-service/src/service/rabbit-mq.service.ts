import amqp from 'amqplib';
import { InternalServerError } from '../core/error.response';
import ProductFactory from './product.service';
import { IMessage } from '../ultil/interface/message.interface';

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
      (msg) => {
        if (msg) {
          const msgContent = JSON.parse(msg.content.toString()) as IMessage;
          console.log(msgContent);
          ProductFactory.createProduct(
            msgContent.payload.product_type,
            msgContent.payload
          );
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

export const RabbitMqService = {
  connectToRabbitMq,
  connectToRabbitMqForTest,
  consumerQueue,
};

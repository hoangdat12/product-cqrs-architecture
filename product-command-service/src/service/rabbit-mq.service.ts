import amqp from 'amqplib';

const connectToRabbitMq = async () => {
  try {
    // const connUrl = `amqp://${process.env.RABBITMQ_USERNAME}
    //     :${process.env.RABBITMQ_PASSWORD}
    //     @${process.env.RABBITMQ_HOST}`;
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

async function publishMessageForSyncData(message: any) {
  try {
    const queueName = process.env.RABBITMQ_SYNC_QUEUE;
    const exchangeName = process.env.RABBITMQ_EXCHANGE_NAME;
    if (!queueName || !exchangeName) throw new Error('Queue name not found!');
    // Connect to RabbitMQ server
    const { conn, channel } = await connectToRabbitMq();

    // Declare exchange
    await channel.assertExchange(exchangeName, 'direct', { durable: false });

    // await channel.assertQueue(queueName, {
    //   durable: true,
    // });

    // Publish the message to the 'example_queue'
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    // Close the connection
    await channel.close();
    await conn.close();
  } catch (error) {
    throw error;
  }
}

export const RabbitMqService = {
  connectToRabbitMq,
  connectToRabbitMqForTest,
  publishMessageForSyncData,
};

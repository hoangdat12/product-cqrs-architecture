import amqp from 'amqplib';
import { error } from 'console';

// export class RabbitMq {
//   static instance: RabbitMq;
//   conn: amqp.Connection;
//   channel: amqp.Channel;

//   constructor() {
//     this.connectToRabbitMq();
//   }

//   async connectToRabbitMq() {
//     try {
//       const connUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

//       amqp
//         .connect(connUrl)
//         .then((connV) => {
//           console.log(connV);
//           this.conn = connV;

//           this.conn
//             .createChannel()
//             .then((channelV) => {
//               console.log(channelV);
//               this.channel = channelV;
//             })
//             .catch((error) => {
//               console.log(error);
//               throw error;
//             });
//         })
//         .catch((err) => {
//           console.log(err);
//           throw err;
//         });
//     } catch (error) {
//       throw error;
//     }
//   }

//   static getInstance() {
//     if (!RabbitMq.instance) {
//       RabbitMq.instance = new RabbitMq();
//     }
//     return RabbitMq.instance;
//   }
// }

export const connectToRabbitMq = async () => {
  try {
    const connUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

    const conn = await amqp.connect(connUrl);
    if (!conn) throw new Error('Connection not Established!');

    const channel = await conn.createChannel();
    return { conn, channel };
  } catch (error) {
    throw error;
  }
};

export const connectToRabbitMqForTest = async () => {
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

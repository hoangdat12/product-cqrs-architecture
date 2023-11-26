import express, { Express, Request, Response } from 'express';
import { catchError } from './middleware/catch-error.middleware';
import * as dotenv from 'dotenv';

import productRoute from './router/product.router';
import { RabbitMqService } from './service/rabbit-mq.service';
import Mongodb from './dbs/init.mongodb';

dotenv.config();
const app: Express = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RabbitMqService.consumerQueue();
Mongodb.getInstance();
app.use('/product/query', productRoute);

// TEST
app.get('/', async (req: Request, res: Response) => {
  return res.json('Hi From Game Server!');
});

app.use(catchError); // catch error

export default app;

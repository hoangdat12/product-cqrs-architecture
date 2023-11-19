import express, { Express, Request, Response } from 'express';
import { catchError } from './middleware/catch-error.middleware';
import * as dotenv from 'dotenv';

import productRoute from './router/product.router';
import { RabbitMqService } from './service/rabbit-mq.service';

dotenv.config();
const app: Express = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RabbitMqService.consumerQueue();

app.use('/product', productRoute);

// TEST
app.get('/', async (req: Request, res: Response) => {
  return res.json('Hi From Game Server!');
});

app.use(catchError); // catch error

export default app;

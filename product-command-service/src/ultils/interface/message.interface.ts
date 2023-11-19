import { IProduct } from './product.interface';

export interface IMessage {
  messageType: 'Create' | 'Update' | 'Delete';
  payload: IProduct;
  timestamp: string | Date;
  correlationId: string;
}

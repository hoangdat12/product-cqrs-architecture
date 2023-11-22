import { IProduct } from './create-product.interface';

export interface IMessage {
  messageType: 'Create' | 'Update' | 'Delete';
  payload: IProduct;
  timestamp: string;
  correlationId: string;
}

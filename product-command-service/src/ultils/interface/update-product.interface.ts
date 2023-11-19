import { ProductType } from '../enum/product.enum';

export class IUpdateProductPayload {
  product_id: string;
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_type: ProductType;

  product_attributes: any;
}

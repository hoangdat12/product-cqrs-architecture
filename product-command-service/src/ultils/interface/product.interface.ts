import { IsNotEmpty } from 'class-validator';

export class IProduct {
  @IsNotEmpty()
  product_name: string;
  @IsNotEmpty()
  product_thumb: string;
  @IsNotEmpty()
  product_description: string;
  @IsNotEmpty()
  product_price: number;
  @IsNotEmpty()
  product_type: string;
  @IsNotEmpty()
  product_shop: string;

  product_attributes: any;

  imageNames: string[];
}

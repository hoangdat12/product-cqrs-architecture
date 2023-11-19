import { IsNotEmpty } from 'class-validator';

export class IUploadImagePayload {
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  shopId: string;
}

import { IMessage } from './interface/message.interface';
import { IProductMapping } from './interface/product-mapping.interface';

export const getProductMappingData = (data: IMessage): IProductMapping => {
  const { payload } = data;
  return {
    id: payload._id,
    product_name: payload.product_name,
    product_thumb: payload.product_thumb,
    product_price: payload.product_price,
    product_type: payload.product_type,
    product_shop: payload.product_shop,
    product_ratingAverage: 4.5,
    isDraft: true,
    isPublished: false,
    product_images: payload.product_images,
    createdAt: new Date(data.timestamp),
    updatedAt: new Date(data.timestamp),
  };
};

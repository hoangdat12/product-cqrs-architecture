export interface IProductMapping {
  id: string;
  product_name: string;
  product_thumb: string;
  product_price: number;
  product_type: string;
  product_shop: string;
  product_ratingAverage: number;
  isDraft: boolean;
  isPublished: boolean;
  product_images: string[];
  createdAt: Date;
  updatedAt: Date;
}

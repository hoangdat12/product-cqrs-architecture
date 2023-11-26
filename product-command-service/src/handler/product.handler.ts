import { AppDataSource } from '../database/data-source';
import { Product } from '../entity/product.entity';
import { IProduct } from '../ultils/interface/product.interface';
import { IUpdateProductPayload } from '../ultils/interface/update-product.interface';

const productRepository = AppDataSource.getRepository(Product);

export class ProductHandler {
  static async findById(productId: string): Promise<Product | null> {
    return await productRepository.findOne({
      where: {
        id: productId,
      },
    });
  }

  static async findOneByName(
    name: string,
    shopId: string
  ): Promise<Product | null> {
    return await productRepository.findOne({
      where: {
        product_name: name,
        product_shop: shopId,
      },
    });
  }

  static async create(payload: IProduct): Promise<Product> {
    const newProduct = new Product();
    newProduct.product_name = payload.product_name.trim();
    newProduct.product_description = payload.product_description.trim();
    newProduct.product_price = payload.product_price;
    newProduct.product_type = payload.product_type;
    newProduct.product_attributes = JSON.stringify(payload.product_attributes);
    newProduct.product_thumb = payload.product_thumb;
    newProduct.product_shop = payload.product_shop;
    newProduct.product_images = payload.product_images;

    return await productRepository.save(newProduct);
  }

  static async update(productId: string, payload: any) {
    return await productRepository.update(productId, payload);
  }

  static async delete(productId: string) {
    return await productRepository.delete(productId);
  }
}

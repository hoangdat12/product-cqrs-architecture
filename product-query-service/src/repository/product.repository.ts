import { NotFound } from '../core/error.response';
import { _Product } from '../model/product.model';
import { IProduct } from '../ultil/interface/create-product.interface';
import { IPagination } from '../ultil/interface/pagination.interface';

export class ProductRepository {
  static async findProductById(productId: string) {
    return await _Product.findOne({ _id: productId }).lean();
  }

  static async findProducts(
    pagination: IPagination,
    filter?: any,
    select?: any[]
  ) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const products = await _Product
      .find(filter)
      .skip(offset)
      .limit(limit)
      .lean();

    return products;
  }

  static async findAllDraftForShop({ query, limit, page }) {
    return await ProductRepository.findProductWithQuery({ query, limit, page });
  }

  static async findAllPublishForShop({ query, limit, page }) {
    return await ProductRepository.findProductWithQuery({ query, limit, page });
  }

  static async updateProductOfShop(
    productId: string,
    updated: IProduct,
    model: any
  ) {
    const productUpdate = await model
      .findOneAndUpdate(
        {
          _id: productId,
        },
        updated,
        {
          new: true,
        }
      )
      .lean();
    return productUpdate;
  }

  static async findProductWithQuery({ query, limit, page }) {
    return await _Product
      .find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }
}

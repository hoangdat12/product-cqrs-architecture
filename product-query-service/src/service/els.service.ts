import { PRODUCT_IDX } from '../constant/els.constant';
import client from '../dbs/init.elastic';
import { IPagination } from '../ultil/interface/pagination.interface';
import { IProductMapping } from '../ultil/interface/product-mapping.interface';
import { updateNestedObjectParse } from '../ultil/update-nested-object';

export class ElasticsearchService {
  static async searchProduct(keyword: string, pagination: IPagination) {
    const { limit, page } = pagination;
    const offset = (page - 1) * limit;
    try {
      const response = await client.search({
        index: PRODUCT_IDX,
        body: {
          from: offset,
          size: limit,
          query: {
            match: {
              product_name: keyword,
            },
          },
        },
      });

      const products = response.hits.hits;
      const total = response.hits.total;
      return {
        products,
        pagination: {
          ...pagination,
          total,
        },
      };
    } catch (error) {
      console.error('Error performing full-text search:', error);
    }
  }

  static async createProduct(payload: IProductMapping): Promise<void> {
    try {
      await client.index({
        index: PRODUCT_IDX,
        id: payload.id,
        body: payload,
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }

  static async updateProduct(payload: IProductMapping): Promise<void> {
    const { id: productId, ...data } = payload;
    const updateData = updateNestedObjectParse(data);
    try {
      await client.update({
        index: PRODUCT_IDX,
        id: productId,
        body: {
          doc: updateData,
        },
      });
    } catch (error) {
      console.error('Error update product:', error);
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      await client.delete({
        index: PRODUCT_IDX,
        id: productId,
      });
    } catch (error) {
      console.error('Error update product:', error);
    }
  }
}

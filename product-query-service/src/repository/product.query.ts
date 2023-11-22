import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import ProductFactory from '../service/product.service';
import { getPaginationData } from '../ultil/get-pagination';
import { IProduct } from '../ultil/interface/create-product.interface';

export class ProductQuery {
  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await ProductFactory.getProductDetail(productId);
      return new OK(product).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationData(req.query);
      return new OK(await ProductFactory.getProducts(pagination)).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async findAllDraftForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shopId } = req.params;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ProductFactory.findAllDraftForShop(shopId, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async findAllPublishForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shopId } = req.params;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ProductFactory.findAllPublishForShop(shopId, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async searchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { s: keyword } = req.query;
      const pagination = getPaginationData(req.query);
      //   return new OK(await ProductFactory.searchProduct(keyword?.trim(), pagination))
    } catch (error) {
      next(error);
    }
  }

  // Test
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyData = req.body as IProduct;
      return new OK(
        await ProductFactory.createProductV2(bodyData.product_type, bodyData)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

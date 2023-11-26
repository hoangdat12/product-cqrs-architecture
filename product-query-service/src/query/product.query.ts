import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import ProductFactory from '../service/product.service';
import { getPaginationData } from '../ultil/get-pagination';
import { IProduct } from '../ultil/interface/create-product.interface';
import { ElasticsearchService } from '../service/els.service';

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
      const keyword: string = req.query.s as unknown as string;
      const pagination = getPaginationData(req.query);
      if (!keyword) return new OK([]);
      return new OK(
        await ElasticsearchService.searchProduct(keyword, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }
}

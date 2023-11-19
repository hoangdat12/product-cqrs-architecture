import { NextFunction, Request, Response } from 'express';
import { IProduct } from '../ultils/interface/product.interface';
import { validate } from 'class-validator';
import { BadRequest } from '../core/error.response';
import { CREATED, OK } from '../core/success.response';
import { ProductService } from '../service/product.service';

export class ProductCommand {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyData = req.body as IProduct;
      const errors = await validate(bodyData);
      if (errors.length) throw new BadRequest('Invalid request value!');
      return new CREATED(await ProductService.createProduct(bodyData)).send(
        res
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyData = req.body;
      return new OK(await ProductService.updateProduct(bodyData)).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async uploadImageForProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const file = req.file;
      return new OK(await ProductService.uploadImage(file)).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async uploadMultiImageForProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const files = req.files;
      return new OK(await ProductService.uploadImages(files)).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.body;
      return new OK(await ProductService.deleteProduct(product_id)).send(res);
    } catch (error) {
      next(error);
    }
  }
}

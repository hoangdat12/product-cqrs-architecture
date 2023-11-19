import { randomUUID } from 'crypto';
import { BadRequest, NotFound } from '../core/error.response';
import { ProductHandler } from '../handler/product.handler';
import { IMessage } from '../ultils/interface/message.interface';
import { IProduct } from '../ultils/interface/product.interface';
import { RabbitMqService } from './rabbit-mq.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Service } from '../config/s3.config';
import { imageNameRandom } from '../ultils/random/name-image.random';
import { removeNullOrUndefinedFromRequest } from '../ultils/remove-null-value';
import { IUpdateProductPayload } from '../ultils/interface/update-product.interface';

export class ProductService {
  static async createProduct(payload: IProduct) {
    const { product_name, product_shop } = payload;
    // Check shop exist or not

    // Check product of Shop exist or not
    const foundProduct = await ProductHandler.findOneByName(
      product_name,
      product_shop
    );
    if (foundProduct) throw new BadRequest('Product is exist in Shop!');

    const newProduct = await ProductHandler.create(payload);

    // Sync data for Query Server
    const message: IMessage = {
      messageType: 'Create',
      payload,
      timestamp: newProduct.createdAt,
      correlationId: randomUUID(),
    };
    await RabbitMqService.publishMessageForSyncData(message);

    return newProduct;
  }

  static async uploadImage(file: any) {
    if (!file) throw new BadRequest('Missing file!');
    // Random for image name
    const imageName = imageNameRandom();
    const command = new S3Service.PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg',
    });

    await S3Service.s3.send(command);

    const signedUrl = new S3Service.GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageName,
    });

    const url = await getSignedUrl(S3Service.s3, signedUrl, {
      expiresIn: 3600,
    });

    return url;
  }

  static async uploadImages(files: any) {
    if (!files.length) throw new BadRequest('Missing file!');
    // Random for image name
    const filesUploadP: Promise<any>[] = [];
    const imageNames: string[] = [];
    for (let file of files) {
      const imageName = imageNameRandom();
      const command = new S3Service.PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: 'image/jpeg',
      });
      imageNames.push(imageName);
      filesUploadP.push(S3Service.s3.send(command));
    }
    await Promise.all(filesUploadP);
    const urlUploadP: Promise<any>[] = [];
    for (let imageName of imageNames) {
      const signedUrl = new S3Service.GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageName,
      });

      urlUploadP.push(
        getSignedUrl(S3Service.s3, signedUrl, {
          expiresIn: 3600,
        })
      );
    }
    const urls = await Promise.all(urlUploadP);
    return {
      urls,
      imageNames,
    };
  }

  static async updateProduct(payload: IUpdateProductPayload) {
    // Check owner product
    const { product_id, ...data } = payload;
    // Check product exist or not
    const foundProduct = await ProductHandler.findById(product_id);
    if (!foundProduct) throw new NotFound('Product not found!');

    const dataUpdate = removeNullOrUndefinedFromRequest(data);
    if (data.product_attributes) {
      dataUpdate.product_attributes = JSON.stringify(
        dataUpdate.product_attributes
      );
    }

    await ProductHandler.update(product_id, dataUpdate);
    return {
      product: await ProductHandler.findById(product_id),
    };
  }

  static async deleteProduct(productId: string) {
    // Check owner

    const foundProduct = await ProductHandler.findById(productId);
    if (!foundProduct) throw new NotFound('Product not found!');

    return await ProductHandler.delete(productId);
  }
}

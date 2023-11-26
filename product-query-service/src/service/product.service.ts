import { _Product, _Clothing, _Electronic } from '../model/product.model';
import { BadRequest } from '../core/error.response';
import { IProduct } from '../ultil/interface/create-product.interface';
import { ProductRepository } from '../repository/product.repository';
import { IPagination } from '../ultil/interface/pagination.interface';
import { removeNullOrUndefinedFromRequest } from '../ultil/remove-null-value';
import { updateNestedObjectParse } from '../ultil/update-nested-object';

// A factory class to create different types of products
class ProductFactory {
  static productRegister = {};
  static modelRegister = {};

  static registerProductType(productType: string, classRef: any) {
    this.productRegister[productType] = classRef;
  }

  static registerModel(productType: string, modelRef: any) {
    this.modelRegister[productType] = modelRef;
  }

  // static async createProduct(
  //   type: string,
  //   productId: string,
  //   payload: IProduct
  // ) {
  //   const productClass = this.productRegister[type];
  //   if (!productClass) {
  //     throw new BadRequest('Type not found!');
  //   }
  //   return new productClass(payload).createProduct(productId);
  // }

  static async createProductV2(
    type: string,
    payload: IProduct
    // createdAt: string
  ) {
    const modelType = this.modelRegister[type];
    if (!modelType) throw new BadRequest('Type not found!');

    const productP = _Product.create({
      ...payload,
      // createdAt: createdAt,
    });
    const productTypeP = modelType.create({
      _id: payload._id,
      ...payload.product_attributes,
      // createdAt: createdAt,
    });
    const [product, _] = await Promise.all([productP, productTypeP]);
    return product;
  }

  static async getProductDetail(productId: string) {
    const foundProduct = await ProductRepository.findProductById(productId);
    return foundProduct;
  }

  static async getProducts(pagination: IPagination) {
    const products = await ProductRepository.findProducts(pagination);
    return {
      products,
      pagination: {
        ...pagination,
        size: products.length,
      },
    };
  }

  static async findAllDraftForShop(shopId: string, pagination: IPagination) {
    const { page, limit } = pagination;
    const query = {
      product_shop: shopId.toString(),
      isDraft: true,
    };
    return await ProductRepository.findAllDraftForShop({ query, limit, page });
  }

  static async findAllPublishForShop(shopId: string, pagination: IPagination) {
    const { page, limit } = pagination;
    const query = {
      product_shop: shopId.toString(),
      isDraft: false,
      isPublished: true,
    };
    return await ProductRepository.findAllPublishForShop({
      query,
      limit,
      page,
    });
  }

  // static async updateProduct(type: string, payload: IProduct) {
  //   const productClass = this.productRegister[type];
  //   if (!productClass) {
  //     throw new BadRequest('Type not found!');
  //   }
  //   return new productClass(payload).updateProductOfShop(payload._id);
  // }

  static async updateProductV2(type: string, payload: IProduct) {
    // Get model Product type [_Clothing | _Electronic]
    const modelType = this.modelRegister[type];
    if (!modelType) throw new BadRequest('Model not found!');

    // Remove null and undifine value for
    const product_attributes = removeNullOrUndefinedFromRequest(
      payload.product_attributes
    );
    const { _id: productId, ...updatePayload } = payload;
    // Update
    const modelProductTypeP = _Electronic.findOneAndUpdate(
      { _id: productId },
      { product_attributes }
    );
    const productP = _Product.findOneAndUpdate(
      {
        _id: productId,
      },
      updateNestedObjectParse({ ...updatePayload })
    );
    const [product, _] = await Promise.all([productP, modelProductTypeP]);

    return product;
  }

  // static async deleteProduct(type: string, productId: string) {
  //   const productClass = this.productRegister[type];
  //   if (!productClass) throw new BadRequest('Type not found!');
  //   return new productClass({}).deleteProduct(productId);
  // }

  static async deleteProductV2(type: string, productId: string) {
    // Get model Product type [_Clothing | _Electronic]
    const modelType = this.modelRegister[type];
    if (!modelType) throw new BadRequest('Model not found!');

    // Delete
    const modelProductTypeP = modelType.deleteOne({ _id: productId });
    const productP = _Product.deleteOne({ _id: productId });
    const [product, _] = await Promise.all([productP, modelProductTypeP]);

    return product;
  }
}

// // A base class for all products
// class Product {
//   protected product_name: string;
//   protected product_thumb: string;
//   protected product_description: string;
//   protected product_price: number;
//   protected product_type: string;
//   protected product_shop: string;
//   protected product_attributes: any;

//   constructor(payload: IProduct) {
//     // Initializing the properties of the product
//     this.product_name = payload.product_name;
//     this.product_thumb = payload.product_thumb;
//     this.product_description = payload.product_description;
//     this.product_price = payload.product_price;
//     this.product_type = payload.product_type;
//     this.product_shop = payload.product_shop;
//     this.product_attributes = payload.product_attributes;
//   }

//   // Method to create a new product in the database
//   async createProduct(productId: any) {
//     // return await _Product.create({ _id: productId, ...this });
//     await _Product.create({ _id: productId, ...this });
//   }

//   async updateProduct(productId: string) {
//     const updatePayload = updateNestedObjectParse({ ...this });
//     return await _Product.findOneAndUpdate({ _id: productId }, updatePayload);
//   }

//   async deleteProduct(productId: string) {
//     return await _Product.deleteOne({ _id: productId });
//   }
// }

// // CLOTHING
// class Clothing extends Product {
//   async createProduct(productId: string) {
//     // Creating the clothing product
//     const clothing = await _Clothing.create({
//       _id: productId,
//       ...this.product_attributes,
//       product_shop: this.product_shop,
//     });
//     if (!clothing) {
//       throw new InternalServerError('Create product Error!');
//     }
//     // Creating a new product instance using the base class's createProduct method
//     return super.createProduct(clothing._id);
//   }

//   async updateProductOfShop(productId: string) {
//     // Remove null and undifine value in constructor
//     this.product_attributes = removeNullOrUndefinedFromRequest(
//       this.product_attributes
//     );
//     // Update for Clothing
//     const clothingP = _Clothing.findOneAndUpdate(
//       { _id: productId },
//       { ...this.product_attributes }
//     );
//     const productP = super.updateProduct(productId);
//     const [product, _] = await Promise.all([productP, clothingP]);
//     // update Product
//     return product;
//   }

//   async deleteProductOfShop(productId: string) {
//     await _Clothing.deleteOne({ _id: productId });
//     return super.deleteProduct(productId);
//   }
// }

// // ELECTRONIC
// class Electronic extends Product {
//   async createProduct() {
//     // Creating the electronic product
//     const electronic = await _Electronic.create({
//       ...this.product_attributes,
//       product_shop: this.product_shop,
//     });
//     if (!electronic) {
//       throw new InternalServerError('Create product Error!');
//     }
//     // Creating a new product instance using the base class's createProduct method
//     return super.createProduct(electronic._id);
//   }

//   async updateProductOfShop(productId: string) {
//     // Remove null and undifine value in constructor
//     this.product_attributes = removeNullOrUndefinedFromRequest(
//       this.product_attributes
//     );
//     // Update for Clothing
//     const clothingP = _Electronic.findOneAndUpdate(
//       { _id: productId },
//       { ...this.product_attributes }
//     );
//     const productP = super.updateProduct(productId);
//     const [product, _] = await Promise.all([productP, clothingP]);
//     // update Product
//     return product;
//   }

//   async deleteProductOfShop(productId: string) {
//     await _Electronic.deleteOne({ _id: productId });
//     return super.deleteProduct(productId);
//   }
// }

// ProductFactory.registerProductType('Clothing', Clothing);
// ProductFactory.registerProductType('Electronic', Electronic);

ProductFactory.registerModel('Clothing', _Clothing);
ProductFactory.registerModel('Electronic', _Electronic);

export default ProductFactory;

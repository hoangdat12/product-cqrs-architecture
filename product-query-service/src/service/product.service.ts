import { _Product, _Clothing, _Electronic } from '../model/product.model';
import { BadRequest, InternalServerError } from '../core/error.response';
import { IProduct } from '../ultil/interface/create-product.interface';
import { ProductRepository } from '../repository/product.repository';
import { IPagination } from '../ultil/interface/pagination.interface';
import { removeNullOrUndefinedFromRequest } from '../ultil/remove-null-value';
import { UpdateNestedObjectParse } from '../ultil/update-nested-object';

// A factory class to create different types of products
class ProductFactory {
  static productRegister = {};

  static registerProductType(productType: string, classRef) {
    this.productRegister[productType] = classRef;
  }

  static async createProduct(type: string, payload: IProduct) {
    const productClass = this.productRegister[type];
    if (!productClass) {
      throw new BadRequest('Type not found!');
    }
    return new productClass(payload).createProduct();
  }

  static async getProductDetail(productId: string) {
    const foundProduct = await ProductRepository.findProductById(productId);
    return foundProduct;
  }

  static async getProducts(pagination: IPagination) {
    return await ProductRepository.findProducts(pagination);
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

  static async updateProduct({ type, productId, payload }) {
    const productClass = this.productRegister[type];
    if (!productClass) {
      throw new BadRequest('Type not found!');
    }
    return new productClass(payload).updateProductOfShop(productId);
  }
}

// A base class for all products
class Product {
  protected product_name: string;
  protected product_thumb: string;
  protected product_description: string;
  protected product_price: number;
  protected product_type: string;
  protected product_shop: string;
  protected product_attributes: any;
  constructor(payload: IProduct) {
    // Initializing the properties of the product
    this.product_name = payload.product_name;
    this.product_thumb = payload.product_thumb;
    this.product_description = payload.product_description;
    this.product_price = payload.product_price;
    this.product_type = payload.product_type;
    this.product_shop = payload.product_shop;
    this.product_attributes = payload.product_attributes;
  }

  // Method to create a new product in the database
  async createProduct(productId: any) {
    return await _Product.create({ _id: productId, ...this });
  }

  async updateProductOfShop(productId: string) {
    // Remove attribute null or undifined
    const objectParams = removeNullOrUndefinedFromRequest(this);
    // Check Product update
    const updateProduct = await super.updateProductOfShop(
      productId,
      UpdateNestedObjectParse(objectParams)
    );
    if (objectParams.product_attributes) {
      await ProductRepository.updateProductOfShop(
        productId,
        updated: UpdateNestedObjectParse(objectParams.product_attributes),
        model: _Clothing,
      );
    }
    return updateProduct;
  }
}

// CLOTHING
class Clothing extends Product {
  async createProduct() {
    // Creating the clothing product
    const clothing = await _Clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!clothing) {
      throw new InternalServerError('Create product Error!');
    }
    // Creating a new product instance using the base class's createProduct method
    return super.createProduct(clothing._id);
  }

  async updateProductOfShop(productId: string) {
    this.product_attributes = removeNullOrUndefinedFromRequest(
      this.product_attributes
    );
    await _Clothing.findOneAndUpdate(
      { _id: productId },
      { ...this.product_attributes }
    );

    return super.updateProduct();
  }
}

// ELECTRONIC
class Electronic extends Product {
  async createProduct() {
    // Creating the electronic product
    const electronic = await _Electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!electronic) {
      throw new InternalServerError('Create product Error!');
    }
    // Creating a new product instance using the base class's createProduct method
    return super.createProduct(electronic._id);
  }
}

ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);

export default ProductFactory;

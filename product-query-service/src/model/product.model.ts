import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import {
  CLOTHING_COLLECTION_NAME,
  CLOTHING_DOCUMENT_NAME,
  ELECTRONIC_COLLECTION_NAME,
  ELECTRONIC_DOCUMENT_NAME,
  PRODUCT_COLLECTION_NAME,
  PRODUCT_DOCUMENT_NAME,
} from '../constant/db.constant';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_slug: String,
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_type: { type: String, required: true },
    product_shop: { type: String, required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: 'Number',
      default: 4.5,
      min: [1, 'Rating must be greater 1.0'],
      max: [5, 'Rating must be lesser 5.0'],
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    product_images: { type: Array },
  },
  {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true,
  }
);

// Document middleware: runs before .save() and .create() ,...
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: Array,
    meterial: String,
    color: Array,
  },
  {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufactor: { type: String, required: true },
    color: Array,
    meterial: String,
  },
  {
    collection: ELECTRONIC_COLLECTION_NAME,
    timestamps: true,
  }
);

const _Product = model(PRODUCT_DOCUMENT_NAME, productSchema);
const _Clothing = model(CLOTHING_DOCUMENT_NAME, clothingSchema);
const _Electronic = model(ELECTRONIC_DOCUMENT_NAME, electronicSchema);

export { _Product, _Clothing, _Electronic };

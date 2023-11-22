import { Client, HttpConnection } from '@elastic/elasticsearch';
import { PRODUCT_IDX } from '../constant/els.constant';
import { IProductMapping } from '../ultil/interface/product-mapping.interface';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config();
const username = process.env.ELS_USERNAME;
const password = process.env.ELS_PASSWORD;
if (!username || !password)
  throw Error('Missing username password when connect ELS!');

const client = new Client({
  node: process.env.ELS_END_POINT, // Elasticsearch endpoint
  auth: {
    username,
    password,
  },
  caFingerprint: process.env.ELS_CA_FINGERPRINT,
  tls: {
    // ca: fs.readFileSync(path.join(__dirname, './http_ca.crt'), 'utf-8'),
    rejectUnauthorized: false,
  },
});

// const client = new Client({
//   node: process.env.ELS_END_POINT,
//   Connection: HttpConnection,
// });

export async function createIndexWithMapping() {
  try {
    // Create the index with the specified mapping
    const response = await client.indices.create({
      index: PRODUCT_IDX,
      body: {
        mappings: {
          dynamic: 'strict',
          properties: {
            id: { type: 'keyword' }, // Define your custom _id field here
            product_name: { type: 'text' },
            product_thumb: { type: 'text', index: false },
            product_price: { type: 'double' },
            product_type: { type: 'keyword' },
            product_shop: { type: 'keyword' },
            product_ratingAverage: { type: 'double' },
            isDraft: { type: 'boolean', index: false },
            isPublished: { type: 'boolean', index: false },
            product_images: { type: 'text', index: false },
            createdAt: { type: 'date', index: false },
            updatedAt: { type: 'date', index: false },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

export async function createProduct(data: IProductMapping) {
  try {
    const response = await client.index({
      index: PRODUCT_IDX,
      id: data.id,
      body: data,
    });

    console.log(
      `Product "${data.product_name}" created successfully:`,
      response
    );
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

export default client;

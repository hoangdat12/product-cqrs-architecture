import { PRODUCT_IDX } from '../../constant/els.constant';
import client from '../../dbs/init.elastic';

export async function createIndexWithMapping() {
  try {
    // Create the index with the specified mapping
    await client.indices.create({
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

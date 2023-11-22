import { Router } from 'express';
import { ProductQuery } from '../repository/product.query';

const router = Router();

router.get('/:productId', ProductQuery.getProduct);
router.get('', ProductQuery.getProducts);
router.get('/shop/draft/:shopId', ProductQuery.findAllDraftForShop);
router.get('/shop/publish/:shopId', ProductQuery.findAllPublishForShop);

// Test
router.post('', ProductQuery.createProduct);

export default router;

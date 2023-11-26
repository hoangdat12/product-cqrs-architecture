import { Router } from 'express';
import { ProductQuery } from '../query/product.query';

const router = Router();

router.get('', ProductQuery.getProducts);
router.get('/shop/draft/:shopId', ProductQuery.findAllDraftForShop);
router.get('/shop/publish/:shopId', ProductQuery.findAllPublishForShop);
router.get('/search', ProductQuery.searchProduct);
router.get('/:productId', ProductQuery.getProduct);

export default router;

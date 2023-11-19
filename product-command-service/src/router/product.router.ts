import { Router } from 'express';
import { ProductCommand } from '../command/product.command';
import { upload } from '../config/multer.config';

const router = Router();

router.post('', ProductCommand.createProduct);
router.post(
  '/upload/image',
  upload.single('image'),
  ProductCommand.uploadImageForProduct
);
router.post(
  '/upload/mul-image',
  upload.array('images', 10),
  ProductCommand.uploadMultiImageForProduct
);
router.patch('', ProductCommand.updateProduct);
router.delete('', ProductCommand.deleteProduct);

export default router;

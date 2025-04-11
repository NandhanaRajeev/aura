import express from 'express';
import { getAllProducts, getProductById, createProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/get-products', getAllProducts);
router.get('/get-product/:id', getProductById);
router.post('/create-product', createProduct);

export default router;

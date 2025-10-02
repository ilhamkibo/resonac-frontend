import { 
  productSchema, 
  productsSchema, 
  CreateProductPayload 
} from '@/lib/validators/productSchema';
import api from '../api';

export const productService = {
  // GET semua produk
  async getAll() {
    const response = await api.get('/products');
    // Validasi data respons dari API sebelum dikirim ke komponen
    return productsSchema.parse(response.data);
  },

  // GET produk berdasarkan ID
  async getById(id: string) {
    const response = await api.get(`/products/${id}`);
    // Validasi data respons
    return productSchema.parse(response.data);
  },

  // POST produk baru
  async create(payload: CreateProductPayload) {
    // Payload sudah divalidasi oleh form sebelum sampai di sini
    const response = await api.post('/products', payload);
    return productSchema.parse(response.data);
  },

  // PUT untuk update produk
  async update(id: string, payload: CreateProductPayload) {
    const response = await api.put(`/products/${id}`, payload);
    return productSchema.parse(response.data);
  },

  // DELETE produk
  async delete(id: string) {
    await api.delete(`/products/${id}`);
    return { message: 'Product deleted successfully' };
  },
};
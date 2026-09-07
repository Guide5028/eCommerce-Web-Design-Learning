import { client } from '../config/axios';

export const saleService = {
  createSale: async (cartItems) => {
    const payload = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price 
      }))
    };
    return await client.post('/sales', payload);
  }
};

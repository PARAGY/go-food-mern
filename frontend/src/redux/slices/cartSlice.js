import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id && item.size === newItem.size);
      
      state.totalQuantity += newItem.qty;
      state.totalAmount += newItem.price;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          qty: newItem.qty,
          size: newItem.size,
          img: newItem.img
        });
      } else {
        existingItem.qty += newItem.qty;
        existingItem.price += newItem.price;
      }
    },
    removeFromCart(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find(item => item.id === id && item.size === size);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.qty;
        state.totalAmount -= existingItem.price;
        state.items = state.items.filter(item => !(item.id === id && item.size === size));
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

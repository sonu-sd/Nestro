import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/Cartslice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;

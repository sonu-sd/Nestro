import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/Cartslice";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

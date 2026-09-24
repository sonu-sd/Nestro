import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  original_total: 0,
  final_total: 0,
  hydrated: false,
  syncStatus: "idle",
};

const recalculate = (state) => {
  state.original_total = state.items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 0),
    0,
  );
  state.final_total = state.items.reduce(
    (total, item) =>
      total + Number(item.salePrice ?? item.price ?? 0) * Number(item.qty || 0),
    0,
  );
};

const productItems = (items = []) =>
  items
    .filter((item) => item?.productId)
    .map((item) => ({ ...item.productId, qty: Number(item.qty || 1) }));

export const cartslice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const product = state.items.find((item) => item._id === payload._id);
      if (product) product.qty = Math.min(Number(product.qty || 1) + 1, 5);
      else state.items.push({ ...payload, qty: 1 });
      recalculate(state);
    },
    lsToCart: (state, { payload }) => {
      state.items = Array.isArray(payload?.items)
        ? payload.items.filter(
            (item) =>
              typeof item?._id === "string" &&
              Number.isInteger(Number(item.qty)) &&
              Number(item.qty) >= 1 &&
              Number(item.qty) <= 5,
          )
        : [];
      recalculate(state);
    },
    dbToCart: (state, { payload }) => {
      state.items = productItems(payload);
      recalculate(state);
    },
    emptyCart: (state) => {
      state.items = [];
      recalculate(state);
    },
    increaseQty: (state, { payload }) => {
      const product = state.items.find((item) => item._id === payload);
      if (product) product.qty = Math.min(Number(product.qty || 1) + 1, 5);
      recalculate(state);
    },
    decreaseQty: (state, { payload }) => {
      const product = state.items.find((item) => item._id === payload);
      if (!product) return;
      if (Number(product.qty) <= 1)
        state.items = state.items.filter((item) => item._id !== payload);
      else product.qty -= 1;
      recalculate(state);
    },
    removeFromCrt: (state, { payload }) => {
      state.items = state.items.filter((item) => item._id !== payload);
      recalculate(state);
    },
    updateQty: (state, { payload }) => {
      const product = state.items.find((item) => item._id === payload.id);
      const qty = Number(payload.qty);
      if (product && Number.isInteger(qty) && qty >= 1 && qty <= 5)
        product.qty = qty;
      recalculate(state);
    },
    setCartHydrated: (state, { payload = true }) => {
      state.hydrated = payload;
    },
    setCartSyncStatus: (state, { payload }) => {
      state.syncStatus = payload;
    },
  },
});

export const {
  addToCart,
  lsToCart,
  dbToCart,
  emptyCart,
  updateQty,
  removeFromCrt,
  decreaseQty,
  increaseQty,
  setCartHydrated,
  setCartSyncStatus,
} = cartslice.actions;
export default cartslice.reducer;

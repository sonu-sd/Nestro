import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  original_total: 0,
  final_total: 0,
};

export const cartslice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =====================================================
    // ADD TO CART
    // =====================================================
  addToCart: (state, { payload }) => {
  const product = state.items.find(
    (item) => item._id === payload._id
  );

  if (product) {
    product.qty = Math.min(Number(product.qty || 1) + 1, 5);
  } else {
    state.items.push({
      ...payload,
      qty: 1,
    });
  }

  state.original_total = state.items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  state.final_total = state.items.reduce(
    (total, item) =>
      total +
      Number(item.salePrice || item.price || 0) *
        Number(item.qty || 0),
    0
  );

  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }
},

    // =====================================================
    // LOAD FROM LOCAL STORAGE
    // =====================================================
    lsToCart: (state, { payload }) => {
      // CHANGED:
      // localStorage ko directly reducer ke andar read nahi
      // kar rahe. Component se parsed cart payload ke through
      // bhejenge.

      if (!payload) return;

      state.items = payload.items || [];

      state.original_total = Number(
        payload.original_total || 0
      );

      state.final_total = Number(
        payload.final_total || 0
      );
    },

    // =====================================================
    // DATABASE -> REDUX
    // =====================================================
    dbToCart: (state, { payload }) => {
      state.items = (payload || []).filter((item) => item?.productId).map((item) => ({
        ...item.productId,

        // CHANGED:
        // qty ko number mein convert
        qty: Number(item.qty || 1),
      }));

      // Calculate original total
      state.original_total = state.items.reduce(
        (total, item) => {
          return (
            total +
            Number(item.price || 0) *
              Number(item.qty || 0)
          );
        },
        0
      );

      // Calculate final total
      state.final_total = state.items.reduce(
        (total, item) => {
          return (
            total +
            Number(
              item.salePrice ||
                item.price ||
                0
            ) *
              Number(item.qty || 0)
          );
        },
        0
      );

      // Save DB cart into localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            original_total:
              state.original_total,
            final_total: state.final_total,
          })
        );
      }
    },

    // =====================================================
    // EMPTY CART
    // =====================================================
    emptyCart: (state) => {
      state.items = [];
      state.original_total = 0;
      state.final_total = 0;

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================
    increaseQty: (state, { payload }) => {
      const product = state.items.find(
        (item) => item._id === payload
      );

      if (!product) return;

      // Maximum 5
      if (product.qty >= 5) {
        return;
      }

      product.qty += 1;

      state.original_total += Number(
        product.price || 0
      );

      state.final_total += Number(
        product.salePrice ||
          product.price ||
          0
      );

      // Save
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            original_total:
              state.original_total,
            final_total: state.final_total,
          })
        );
      }
    },

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================
    decreaseQty: (state, { payload }) => {
      const productIndex = state.items.findIndex(
        (item) => item._id === payload
      );

      if (productIndex === -1) return;

      const product =
        state.items[productIndex];

      if (product.qty <= 1) {
        // Remove product price
        state.original_total -= Number(
          product.price || 0
        );

        state.final_total -= Number(
          product.salePrice ||
            product.price ||
            0
        );

        // Remove product
        state.items.splice(productIndex, 1);
      } else {
        // Decrease quantity
        product.qty -= 1;

        state.original_total -= Number(
          product.price || 0
        );

        state.final_total -= Number(
          product.salePrice ||
            product.price ||
            0
        );
      }

      // Prevent negative totals
      state.original_total = Math.max(
        0,
        state.original_total
      );

      state.final_total = Math.max(
        0,
        state.final_total
      );

      // Save
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            original_total:
              state.original_total,
            final_total: state.final_total,
          })
        );
      }
    },

    // =====================================================
    // REMOVE COMPLETE PRODUCT
    // =====================================================
    removeFromCrt: (state, { payload }) => {
      const product = state.items.find(
        (item) => item._id === payload
      );

      if (!product) return;

      state.original_total -=
        Number(product.price || 0) *
        Number(product.qty || 0);

      state.final_total -=
        Number(
          product.salePrice ||
            product.price ||
            0
        ) *
        Number(product.qty || 0);

      state.items = state.items.filter(
        (item) => item._id !== payload
      );

      // Prevent negative values
      state.original_total = Math.max(
        0,
        state.original_total
      );

      state.final_total = Math.max(
        0,
        state.final_total
      );

      // Save
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            original_total:
              state.original_total,
            final_total: state.final_total,
          })
        );
      }
    },

    // =====================================================
    // UPDATE QUANTITY DIRECTLY
    // =====================================================
    updateQty: (state, { payload }) => {
      const { id, qty } = payload;

      const product = state.items.find(
        (item) => item._id === id
      );

      if (!product) return;

      const newQty = Number(qty);

      // CHANGED:
      // Quantity 1 se 5 ke beech honi chahiye
      if (
        !Number.isInteger(newQty) ||
        newQty < 1 ||
        newQty > 5
      ) {
        return;
      }

      // Remove old quantity contribution
      state.original_total -=
        Number(product.price || 0) *
        Number(product.qty || 0);

      state.final_total -=
        Number(
          product.salePrice ||
            product.price ||
            0
        ) *
        Number(product.qty || 0);

      // Set new quantity
      product.qty = newQty;

      // Add new quantity contribution
      state.original_total +=
        Number(product.price || 0) *
        newQty;

      state.final_total +=
        Number(
          product.salePrice ||
            product.price ||
            0
        ) *
        newQty;

      // Prevent negative
      state.original_total = Math.max(
        0,
        state.original_total
      );

      state.final_total = Math.max(
        0,
        state.final_total
      );

      // Save
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            original_total:
              state.original_total,
            final_total: state.final_total,
          })
        );
      }
    },
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  addToCart,
  lsToCart,
  dbToCart,
  emptyCart,
  updateQty,
  removeFromCrt,
  decreaseQty,
  increaseQty,
} = cartslice.actions;

export default cartslice.reducer;


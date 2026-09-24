"use client";

import { useEffect, useRef, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { makeStore } from "./store";
import {
  dbToCart,
  lsToCart,
  setCartHydrated,
  setCartSyncStatus,
} from "./features/Cartslice";
import { client } from "@/utils/helper";

const CART_KEY = "cart";
const OWNER_KEY = "nestro_cart_owner";
const toPayload = (items) =>
  items
    .filter((item) => typeof item?._id === "string")
    .map((item) => ({
      productId: item._id,
      qty: Math.max(1, Math.min(5, Number(item.qty) || 1)),
    }));
const signature = (items) =>
  JSON.stringify(
    toPayload(items).sort((a, b) => a.productId.localeCompare(b.productId)),
  );

function CartSynchronizer() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const signedIn = useRef(false);
  const userId = useRef("");
  const lastSynced = useRef("");
  const latestSignature = useRef(signature(cart.items));

  useEffect(() => {
    latestSignature.current = signature(cart.items);
  }, [cart.items]);

  useEffect(() => {
    let active = true;
    let savedCart = null;
    try {
      savedCart = JSON.parse(localStorage.getItem(CART_KEY));
    } catch {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(OWNER_KEY);
    }
    const localItems = Array.isArray(savedCart?.items) ? savedCart.items : [];
    dispatch(lsToCart({ items: localItems }));

    async function initialize() {
      try {
        const account = await client.get("/user/get-me");
        if (!active) return;
        const currentUserId = account.data.user?._id;
        const cartOwner = localStorage.getItem(OWNER_KEY);
        let response;
        if (!cartOwner && localItems.length)
          response = await client.post("/cart/merge", {
            items: toPayload(localItems),
          });
        else response = await client.get("/cart");
        if (!active) return;
        const dbItems = response.data.data?.items || [];
        signedIn.current = true;
        userId.current = currentUserId;
        lastSynced.current = signature(
          dbItems.map((item) => ({ ...item.productId, qty: item.qty })),
        );
        localStorage.setItem(OWNER_KEY, currentUserId);
        dispatch(dbToCart(dbItems));
        dispatch(setCartSyncStatus("synced"));
      } catch (error) {
        if (!active) return;
        signedIn.current = false;
        if (error.response?.status === 401 && localStorage.getItem(OWNER_KEY)) {
          localStorage.removeItem(CART_KEY);
          localStorage.removeItem(OWNER_KEY);
          dispatch(lsToCart({ items: [] }));
        } else if (error.response?.status !== 401)
          dispatch(setCartSyncStatus("error"));
      } finally {
        if (active) dispatch(setCartHydrated(true));
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!cart.hydrated) return;
    const snapshot = {
      items: cart.items,
      original_total: cart.original_total,
      final_total: cart.final_total,
    };
    localStorage.setItem(CART_KEY, JSON.stringify(snapshot));
    if (!signedIn.current) return;
    localStorage.setItem(OWNER_KEY, userId.current);
    const currentSignature = signature(cart.items);
    if (currentSignature === lastSynced.current) return;
    dispatch(setCartSyncStatus("syncing"));
    const timeout = window.setTimeout(async () => {
      try {
        const response = await client.post("/cart/sync", {
          items: toPayload(cart.items),
        });
        lastSynced.current = currentSignature;
        if (latestSignature.current === currentSignature) {
          dispatch(dbToCart(response.data.data?.items || []));
          dispatch(setCartSyncStatus("synced"));
        }
      } catch (error) {
        if (error.response?.status === 401) signedIn.current = false;
        dispatch(setCartSyncStatus("error"));
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [
    cart.final_total,
    cart.hydrated,
    cart.items,
    cart.original_total,
    dispatch,
  ]);

  return null;
}

export default function Storeprovider({ children }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <CartSynchronizer />
      {children}
    </Provider>
  );
}

import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import Room from "../src/models/room.model.js";
import Product from "../src/models/product.model.js";
import Cart from "../src/models/cart.modal.js";
import Order from "../src/models/order.model.js";
import { signSessionToken } from "../src/utils/auth.js";

const source = new URL(
  process.env.LOCAL_TEST_MONGO_URI || "mongodb://127.0.0.1:27017/Nestro",
);
if (
  source.protocol !== "mongodb:" ||
  !["localhost:27017", "127.0.0.1:27017"].includes(source.host)
)
  throw new Error(
    "Integration test only runs against local MongoDB on port 27017",
  );
const databaseName = `nestro_cart_checkout_test_${crypto.randomBytes(6).toString("hex")}`;
source.pathname = `/${databaseName}`;
source.search = "";

test("guest merge, exact cart sync and server-priced checkout work end to end", async () => {
  let server;
  try {
    await mongoose.connect(source.toString(), {
      serverSelectionTimeoutMS: 5000,
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const [category, room] = await Promise.all([
      Category.create({ name: "Tables", slug: "tables" }),
      Room.create({ name: "Dining", slug: "dining" }),
    ]);
    const user = await User.create({
      name: "Cart Customer",
      email: "cart@checkout-test.local",
      password: "not-a-login-password",
      isVerified: true,
      adresses: [
        {
          fullName: "Cart Customer",
          mobile: "9999999999",
          pincode: "110001",
          adressLine: "1 Test Street",
          city: "Delhi",
          state: "Delhi",
          isDefault: true,
        },
      ],
    });
    const product = await Product.create({
      title: "Dining Table",
      slug: "dining-table",
      description: "Solid wood dining table",
      category: category._id,
      roomType: room._id,
      price: 10000,
      salePrice: 8000,
      material: "Wood",
      thumbnail: "https://example.test/table.jpg",
    });
    await Cart.create({
      userId: user._id,
      items: [{ productId: product._id, qty: 2 }],
    });
    const headers = {
      Authorization: `Bearer ${signSessionToken(user)}`,
      "Content-Type": "application/json",
    };

    const merge = await fetch(`${base}/cart/merge`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: [{ productId: product._id, qty: 3, price: 1 }],
      }),
    });
    assert.equal(merge.status, 200);
    assert.equal((await merge.json()).data.items[0].qty, 5);

    const sync = await fetch(`${base}/cart/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: [{ productId: product._id, qty: 2, price: 1 }],
      }),
    });
    assert.equal(sync.status, 200);
    assert.equal((await sync.json()).data.items[0].qty, 2);

    const summaryResponse = await fetch(`${base}/order/checkout-summary`, {
      headers,
    });
    assert.equal(summaryResponse.status, 200);
    const summary = (await summaryResponse.json()).data;
    assert.equal(summary.items[0].price, 8000);
    assert.equal(summary.subtotal, 16000);
    assert.equal(summary.tax, 800);
    assert.equal(summary.totalAmount, 16849);

    const orderResponse = await fetch(`${base}/order`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        addressId: user.adresses[0]._id,
        paymentMethod: "COD",
        totalAmount: 1,
      }),
    });
    assert.equal(orderResponse.status, 201);
    const order = (await orderResponse.json()).data;
    assert.equal(order.totalAmount, 16849);
    assert.equal(await Order.countDocuments({ user: user._id }), 1);
    assert.equal((await Cart.findOne({ userId: user._id })).items.length, 0);

    const emptySync = await fetch(`${base}/cart/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({ items: [] }),
    });
    assert.equal(emptySync.status, 200);
    assert.equal((await emptySync.json()).data.items.length, 0);
    assert.equal(
      (await fetch(`${base}/order/checkout-summary`, { headers })).status,
      400,
    );
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    if (
      mongoose.connection.readyState === 1 &&
      mongoose.connection.db.databaseName === databaseName
    )
      await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

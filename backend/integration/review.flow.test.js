import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import Room from "../src/models/room.model.js";
import Product from "../src/models/product.model.js";
import Review from "../src/models/review.model.js";
import { signSessionToken } from "../src/utils/auth.js";

const source = new URL(process.env.MONGO_URI);
if (source.protocol !== "mongodb:" || !["localhost:27017", "127.0.0.1:27017"].includes(source.host)) throw new Error("Integration test only runs against local MongoDB on port 27017");
const databaseName = `nestro_review_flow_test_${crypto.randomBytes(6).toString("hex")}`;
source.pathname = `/${databaseName}`;
source.search = "";

test("customer review requires approval and updates product rating", async () => {
  let server;
  try {
    await mongoose.connect(source.toString(), { serverSelectionTimeoutMS: 5000 });
    assert.equal(mongoose.connection.db.databaseName, databaseName);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const [admin, user, category, room] = await Promise.all([
      User.create({ name: "Admin", email: "admin@review-test.local", password: "not-a-login-password", role: "admin", isVerified: true }),
      User.create({ name: "Customer", email: "customer@review-test.local", password: "not-a-login-password", role: "user", isVerified: true }),
      Category.create({ name: "Chairs", slug: "chairs" }),
      Room.create({ name: "Living Room", slug: "living-room" }),
    ]);
    const product = await Product.create({ title: "Oak Chair", slug: "oak-chair", description: "Test chair", category: category._id, roomType: room._id, price: 1000, salePrice: 900, material: "Wood", thumbnail: "https://example.test/chair.jpg" });
    const publicProduct = await fetch(`${base}/product/slug/oak-chair`);
    assert.equal(publicProduct.status, 200);
    assert.equal((await publicProduct.json()).data._id, product._id.toString());
    assert.equal((await fetch(`${base}/product/slug/missing-chair`)).status, 404);
    const headers = (person) => ({ Authorization: `Bearer ${signSessionToken(person)}`, "Content-Type": "application/json" });
    const payload = { product: product._id, rating: 5, title: "Excellent chair", comment: "Beautiful finish and comfortable to sit on every day." };
    assert.equal((await (await fetch(`${base}/product?search=oak`)).json()).total, 1);
    assert.equal((await (await fetch(`${base}/product?search=unknown`)).json()).total, 0);
    assert.equal((await fetch(`${base}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })).status, 401);
    assert.equal((await fetch(`${base}/review`, { method: "POST", headers: headers(admin), body: JSON.stringify(payload) })).status, 403);
    assert.equal((await fetch(`${base}/review`, { method: "POST", headers: headers(user), body: JSON.stringify({ ...payload, rating: 6 }) })).status, 400);
    const submitted = await fetch(`${base}/review`, { method: "POST", headers: headers(user), body: JSON.stringify(payload) });
    assert.equal(submitted.status, 201);
    const reviewId = (await submitted.json()).data._id;
    assert.equal((await fetch(`${base}/review`, { method: "POST", headers: headers(user), body: JSON.stringify(payload) })).status, 409);
    assert.equal((await (await fetch(`${base}/review`)).json()).data.length, 0);
    assert.equal((await fetch(`${base}/review/admin`, { headers: headers(user) })).status, 403);
    assert.equal((await (await fetch(`${base}/review/admin?status=pending`, { headers: headers(admin) })).json()).data.length, 1);
    assert.equal((await fetch(`${base}/review/admin/${reviewId}`, { method: "PATCH", headers: headers(user), body: JSON.stringify({ status: "approved" }) })).status, 403);
    assert.equal((await fetch(`${base}/review/admin/${reviewId}`, { method: "PATCH", headers: headers(admin), body: JSON.stringify({ status: "approved" }) })).status, 200);
    assert.equal((await (await fetch(`${base}/review`)).json()).data.length, 1);
    assert.equal((await Product.findById(product._id)).reviewCount, 1);
    assert.equal((await Product.findById(product._id)).ratingAverage, 5);
    assert.equal((await fetch(`${base}/review/admin/${reviewId}`, { method: "PATCH", headers: headers(admin), body: JSON.stringify({ status: "rejected" }) })).status, 200);
    assert.equal((await (await fetch(`${base}/review`)).json()).data.length, 0);
    assert.equal((await Product.findById(product._id)).reviewCount, 0);
    assert.equal(await Review.countDocuments(), 1);
    await Product.updateOne({ _id: product._id }, { status: false });
    assert.equal((await fetch(`${base}/product/slug/oak-chair`)).status, 404);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    if (mongoose.connection.readyState === 1 && mongoose.connection.db.databaseName === databaseName) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import mongoose from "mongoose";
import app from "../src/app.js";
import userModel from "../src/models/user.model.js";
import categoryModel from "../src/models/category.model.js";
import roomModel from "../src/models/room.model.js";
import ProductModel from "../src/models/product.model.js";
import { signSessionToken } from "../src/utils/auth.js";

const source = new URL(process.env.MONGO_URI);
if (source.protocol !== "mongodb:" || !["localhost:27017", "127.0.0.1:27017"].includes(source.host)) {
    throw new Error("Integration test only runs against local MongoDB on port 27017");
}
const databaseName = `nestro_color_flow_test_${crypto.randomBytes(6).toString("hex")}`;
source.pathname = `/${databaseName}`;
source.search = "";

test("admin color assignment and public color filtering work end to end", async () => {
    let server;
    try {
        await mongoose.connect(source.toString(), { serverSelectionTimeoutMS: 5000 });
        assert.equal(mongoose.connection.db.databaseName, databaseName);
        server = app.listen(0);
        await new Promise((resolve) => server.once("listening", resolve));
        const base = `http://127.0.0.1:${server.address().port}/api`;
        const [admin, user, category, room] = await Promise.all([
            userModel.create({ name: "Test Admin", email: "admin@color-test.local", password: "not-a-login-password", role: "admin", isVerified: true }),
            userModel.create({ name: "Test User", email: "user@color-test.local", password: "not-a-login-password", role: "user", isVerified: true }),
            categoryModel.create({ name: "Test Chairs", slug: "test-chairs" }),
            roomModel.create({ name: "Test Living Room", slug: "test-living-room" }),
        ]);
        const adminHeaders = { Authorization: `Bearer ${signSessionToken(admin)}`, "Content-Type": "application/json" };
        const userHeaders = { Authorization: `Bearer ${signSessionToken(user)}`, "Content-Type": "application/json" };

        const createColor = await fetch(`${base}/color/create`, { method: "POST", headers: adminHeaders, body: JSON.stringify({ name: "Walnut Brown", slug: "walnut-brown", hex: "#8B5E3C" }) });
        assert.equal(createColor.status, 201);
        const color = (await createColor.json()).data;
        assert.equal((await fetch(`${base}/color/create`, { method: "POST", headers: userHeaders, body: JSON.stringify({ name: "Denied", hex: "#112233" }) })).status, 403);

        const baseProduct = { description: "Test furniture", category: category._id, roomType: room._id, price: 1000, salePrice: 900, material: "Wood", thumbnail: "https://example.test/chair.jpg" };
        const [modern, legacy] = await Promise.all([
            ProductModel.create({ ...baseProduct, title: "Modern Chair", slug: "modern-chair" }),
            ProductModel.create({ ...baseProduct, title: "Legacy Chair", slug: "legacy-chair", color: "Walnut Brown" }),
        ]);
        const edit = await fetch(`${base}/product/edit/${modern._id}`, { method: "PUT", headers: adminHeaders, body: JSON.stringify({ colors: [color._id.toString()] }) });
        assert.equal(edit.status, 200);
        assert.deepEqual((await ProductModel.findById(modern._id)).colors.map(String), [color._id.toString()]);

        const filtered = await fetch(`${base}/product?color=walnut-brown`);
        assert.equal(filtered.status, 200);
        const result = await filtered.json();
        assert.equal(result.total, 2);
        assert.deepEqual(new Set(result.data.map((item) => item._id)), new Set([modern._id.toString(), legacy._id.toString()]));

        assert.equal((await fetch(`${base}/color/status-update/${color._id}`, { method: "PATCH", headers: adminHeaders })).status, 200);
        assert.equal((await (await fetch(`${base}/color`)).json()).total, 0);
        assert.equal((await (await fetch(`${base}/product?color=walnut-brown`)).json()).total, 0);
    } finally {
        if (server) await new Promise((resolve) => server.close(resolve));
        if (mongoose.connection.readyState === 1 && mongoose.connection.db.databaseName === databaseName) {
            await mongoose.connection.dropDatabase();
        }
        await mongoose.disconnect();
    }
});

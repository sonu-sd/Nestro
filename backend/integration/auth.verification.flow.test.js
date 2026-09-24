import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import { hashOtp } from "../src/utils/auth.js";

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
const databaseName = `nestro_auth_verification_test_${crypto.randomBytes(6).toString("hex")}`;
source.pathname = `/${databaseName}`;
source.search = "";

test("an incomplete account can safely resume email verification", async () => {
  let server;
  try {
    await mongoose.connect(source.toString(), {
      serverSelectionTimeoutMS: 5000,
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}/api/user`;
    const email = "pending@verification-test.local";
    const password = "verification-password";
    const otp = "123456";
    await User.create({
      name: "Pending Customer",
      email,
      password: await bcrypt.hash(password, 12),
      isVerified: false,
      otp: hashOtp(otp),
      otpExpire: new Date(Date.now() + 60_000),
    });

    const wrongPassword = await fetch(`${base}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "incorrect-password" }),
    });
    assert.equal(wrongPassword.status, 400);
    assert.equal((await wrongPassword.json()).code, undefined);

    const pendingLogin = await fetch(`${base}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(pendingLogin.status, 403);
    assert.equal((await pendingLogin.json()).code, "EMAIL_NOT_VERIFIED");

    const repeatedRegistration = await fetch(`${base}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Pending Customer", email, password }),
    });
    assert.equal(repeatedRegistration.status, 409);
    assert.equal(
      (await repeatedRegistration.json()).code,
      "ACCOUNT_PENDING_VERIFICATION",
    );

    const verification = await fetch(`${base}/otp_verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    assert.equal(verification.status, 200);

    const login = await fetch(`${base}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(login.status, 200);
    assert.match(login.headers.get("set-cookie") || "", /^token=/);
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

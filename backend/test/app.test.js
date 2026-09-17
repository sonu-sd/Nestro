import assert from "node:assert/strict";
import { Writable } from "node:stream";
import test from "node:test";
import app from "../src/app.js";
import cloudinary from "../src/config/cloudinary.js";
import { validateEnvironment } from "../src/config/env.js";
import { uploadBufferToCloudinary } from "../src/middleware/upload.js";

let server;
let baseUrl;

test.before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("health endpoint reports a live API with a request ID", async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
    assert.ok(body.requestId);
    assert.equal(response.headers.get("x-request-id"), body.requestId);
    assert.equal(response.headers.get("x-powered-by"), null);
    assert.ok(response.headers.get("x-content-type-options"));
});

test("readiness endpoint reports not ready before MongoDB connects", async () => {
    const response = await fetch(`${baseUrl}/api/ready`);
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.status, "not_ready");
});

test("unknown routes return a traceable 404 response", async () => {
    const response = await fetch(`${baseUrl}/api/not-a-real-route`);
    const body = await response.json();
    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.ok(body.requestId);
});

test("Cloudinary v2 upload wrapper preserves secure asset metadata", async () => {
    const originalUploadStream = cloudinary.uploader.upload_stream;
    let receivedBuffer;

    cloudinary.uploader.upload_stream = (options, callback) => new Writable({
        write(chunk, encoding, done) {
            receivedBuffer = chunk;
            done();
        },
        final(done) {
            assert.equal(options.folder, "nestro");
            assert.equal(options.resource_type, "image");
            callback(null, {
                secure_url: "https://res.cloudinary.com/demo/image/upload/nestro/example.webp",
                public_id: "nestro/example",
            });
            done();
        },
    });

    try {
        const result = await uploadBufferToCloudinary({ buffer: Buffer.from("image-data") });
        assert.deepEqual(result, {
            path: "https://res.cloudinary.com/demo/image/upload/nestro/example.webp",
            filename: "nestro/example",
        });
        assert.equal(receivedBuffer.toString(), "image-data");
        assert.equal(cloudinary.config().secure, true);
    } finally {
        cloudinary.uploader.upload_stream = originalUploadStream;
    }
});

test("production startup requires every external service configuration", () => {
    const productionEnvironment = {
        NODE_ENV: "production",
        MONGO_URI: "mongodb://example.test/nestro",
        JWT_SECRET: "test-secret",
        CORS_ORIGIN: "https://nestro.example",
        CLOUD_NAME: "cloud-name",
        CLOUDINARY_API_KEY: "api-key",
        CLOUDINARY_SECRET_KEY: "api-secret",
        EMAIL_USER: "noreply@example.test",
        EMAIL_PASS: "email-password",
        RAZORPAY_KEY_ID: "rzp_test_key",
        RAZORPAY_KEY_SECRET: "razorpay-secret",
    };

    assert.doesNotThrow(() => validateEnvironment(productionEnvironment));
    delete productionEnvironment.CORS_ORIGIN;
    assert.throws(() => validateEnvironment(productionEnvironment), /CORS_ORIGIN/);
});

import assert from "node:assert/strict";
import test from "node:test";
import app from "../src/app.js";

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

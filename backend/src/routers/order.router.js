import express from "express"

const router = express.Router()

// Phase 0 safety boundary: the order controller/model are still unfinished.
// Keep the existing URLs unavailable until the full order flow is implemented.
router.use((_req, res) => {
    res.set("Cache-Control", "no-store");
    return res.status(503).json({
        success: false,
        code: "ORDER_SERVICE_UNAVAILABLE",
        message: "Ordering is temporarily unavailable while checkout is being completed."
    });
});

export default router

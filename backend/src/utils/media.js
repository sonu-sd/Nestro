import cloudinary from "../config/cloudinary.js";

export const getUploadMetadata = (file) => ({
    url: file?.path || "",
    publicId: file?.filename || "",
});

export const removeCloudinaryAssets = async (publicIds = []) => {
    const validIds = publicIds.filter(Boolean);
    if (!validIds.length) return;

    const results = await Promise.allSettled(
        validIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    results
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.error("Cloudinary cleanup failed:", result.reason));
};

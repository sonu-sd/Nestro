import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
        }
        return callback(null, true);
    },
});

export const uploadBufferToCloudinary = (file) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        {
            folder: "nestro",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        },
        (error, result) => {
            if (error) return reject(error);

            return resolve({
                path: result.secure_url,
                filename: result.public_id,
            });
        }
    );

    stream.end(file.buffer);
});

const uploadToCloudinary = (multerMiddleware, getFiles) => (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
        if (error) return next(error);

        const files = getFiles(req);
        if (!files.length) return next();

        const uploadedPublicIds = [];

        try {
            for (const file of files) {
                const uploadedFile = await uploadBufferToCloudinary(file);
                Object.assign(file, uploadedFile);
                uploadedPublicIds.push(uploadedFile.filename);
            }

            return next();
        } catch (uploadError) {
            await Promise.allSettled(
                uploadedPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
            );
            return next(uploadError);
        }
    });
};

const upload = {
    single: (fieldName) => uploadToCloudinary(
        multerUpload.single(fieldName),
        (req) => (req.file ? [req.file] : [])
    ),
    array: (fieldName, maxCount) => uploadToCloudinary(
        multerUpload.array(fieldName, maxCount),
        (req) => req.files || []
    ),
};

export default upload;


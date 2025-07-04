// server/middleware/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    let folder = 'helpme/replies';
    if (req.originalUrl.includes('/tickets/create')) {
      folder = 'helpme/tickets';
    }

    return {
      folder,
      resource_type: 'auto',
      public_id: `${file.fieldname}-${Date.now()}`,
      transformation: isImage
        ? [
            { width: 1024, height: 1024, crop: 'limit' }, // Resizes but keeps aspect ratio
            { quality: 'auto' },                          // Auto compression
            { fetch_format: 'auto' }                      // WebP/JPEG/PNG as needed
          ]
        : [],
    };
  },
});

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: PNG, JPG, JPEG, PDF, DOC, DOCX'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});


// Middleware to handle file upload errors
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({ error: err.message });
  }
  next();
};

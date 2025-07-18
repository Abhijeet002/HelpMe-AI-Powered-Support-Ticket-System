import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


// Allowed file types
const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

// Multer filter for allowed types + avatar-specific logic
function fileFilter(req, file, cb) {
  const isAvatarUpload = req.originalUrl.includes("/users/me");

  // Enforce image-only for avatars
  if (isAvatarUpload && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed for profile avatars."));
  }

  // General file type check
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type."));
  }
}

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine target folder
    let folder = "helpme/misc";

    if (req.originalUrl.includes("/tickets/create")) {
      folder = "helpme/tickets";
    } else if (req.originalUrl.includes("/replies")) {
      folder = "helpme/replies";
    } else if (req.originalUrl.includes("/users/me")) {
      folder = "helpme/users/avatars";
    }

    // Determine file extension
    const ext = path.extname(file.originalname); // e.g., .jpg
    const userId = req.user?.id || "anon";
    const timestamp = Date.now();

    return {
      folder,
      public_id: `${file.fieldname}-${userId}-${timestamp}`,
      format: ext.replace(".", ""), // e.g., "jpg"
      transformation: [
        { width: 600, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    };
  },
});

// Multer Upload Middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

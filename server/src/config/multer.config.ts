import { diskStorage } from "multer";
import { extname, join } from "path";
import * as fs from "fs";

const uploadsDir = join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadStorage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname) || "";
    cb(null, `${unique}${ext}`);
  },
});

export const multerOptions = {
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
};

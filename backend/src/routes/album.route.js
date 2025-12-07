import multer from "multer";
import { Router } from "express";
import {
  getALLAlbums,
  getAlbumById,
  deleteAlbum,
  createAlbum
} from "../controller/album.controller.js";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Configure multer with file size limits and file type validation
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = Router();

// GET all albums
router.get("/", getALLAlbums);

// GET album by ID
router.get("/:albumId", getAlbumById);

// CREATE a new album (with file upload)
router.post("/", upload.single("imageFile"), createAlbum);

// DELETE album by ID
router.delete("/:albumId", deleteAlbum);

export default router;
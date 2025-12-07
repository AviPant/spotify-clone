import { Album } from "../models/album.model.js";

// GET all albums
export const getALLAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

// GET album by ID
export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

// DELETE album by ID
export const deleteAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findByIdAndDelete(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// CREATE a new album
export const createAlbum = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file); // Debugging ke liye

    const { title, artist, releaseYear } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Database me save karne ke liye naya album object
    const newAlbumData = {
      title,
      artist,
      releaseYear,
      imageUrl: `/uploads/${imageFile.filename}`, // URL for the frontend
    };

    // Yahan par database me save karne ka logic aayega
    // const createdAlbum = await Album.create(newAlbumData);

    res.status(201).json({
      message: "Album created successfully",
      album: newAlbumData, // Response me naya album bhejein
    });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

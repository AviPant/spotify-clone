import { Song } from "../models/song.model.js";

// Create a new song
export const createSong = async (req, res, next) => {
	try {
		const { title, artist, album, imageUrl, audioUrl } = req.body;

		const song = await Song.create({
			title,
			artist,
			album,
			imageUrl,
			audioUrl,
		});

		res.status(201).json({ success: true, song }); // ✅ Fixed res.json
	} catch (error) {
		console.error("Error creating song:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

// Get all songs
export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 }); // Newest to oldest
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Get 6 featured songs (random)
export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 6 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Get 4 "Made for You" songs (random)
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Get 4 trending songs (random)
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

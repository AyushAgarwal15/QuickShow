import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import https from "https";
import NowPlaying from "../models/NowPlaying.js";

// Caching setup for TMDB now playing movies
let cachedMovies = [];
let cacheTimestamp = 0; // epoch ms
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
  // Serve cached data if it is still fresh
  if (cachedMovies.length && Date.now() - cacheTimestamp < CACHE_TTL) {
    return res.json({ success: true, movies: cachedMovies, source: "cache" });
  }

  try {
    const tmdbKey = process.env.TMDB_API_KEY;

    if (!tmdbKey) {
      return res.json({
        success: false,
        message: "TMDB_API_KEY env variable not set",
      });
    }

    const url = "https://api.themoviedb.org/3/movie/now_playing";
    const axiosOptions = {
      timeout: 6000, // 6-second hard limit so the request never hangs
      httpsAgent: new https.Agent({ family: 4 }), // force IPv4 first to avoid some ISP IPv6 DNS issues
    };

    let response;
    if (tmdbKey.startsWith("ey") || tmdbKey.length > 40) {
      response = await axios.get(url, {
        ...axiosOptions,
        headers: {
          Authorization: `Bearer ${tmdbKey}`,
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json",
        },
      });
    } else {
      response = await axios.get(url, {
        ...axiosOptions,
        params: { api_key: tmdbKey },
      });
    }

    cachedMovies = response.data.results;
    cacheTimestamp = Date.now();

    // Persist to MongoDB for future offline use
    await NowPlaying.findOneAndUpdate(
      { _id: "singleton" },
      { movies: cachedMovies },
      { upsert: true, new: true }
    );

    return res.json({ success: true, movies: cachedMovies, source: "tmdb" });
  } catch (error) {
    console.error("TMDB error:", {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Attempt to serve from MongoDB fallback
    try {
      const doc = await NowPlaying.findById("singleton").lean();
      if (doc && doc.movies && doc.movies.length) {
        cachedMovies = doc.movies; // hydrate in-memory cache for next hit
        cacheTimestamp = Date.now();
        return res.json({
          success: true,
          movies: doc.movies,
          source: "mongodb",
          message: "TMDB unreachable – served movies from database.",
        });
      }
    } catch (dbErr) {
      console.error("MongoDB NowPlaying fetch error:", dbErr.message);
    }

    // Fallback to cache if available
    if (cachedMovies.length) {
      return res.json({
        success: true,
        movies: cachedMovies,
        cached: true,
        message: "TMDB unreachable – served cached list.",
      });
    }

    const tmdbMessage = error?.response?.data?.status_message;
    return res.json({
      success: false,
      message: tmdbMessage || error.message || "Failed to fetch movies",
    });
  }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details and credits from TMDB API
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      // Add movie to the database
      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          updateOne: {
            filter: {
              movie: movieId,
              showDateTime: new Date(dateTimeString),
            },
            update: {
              $setOnInsert: {
                movie: movieId,
                showDateTime: new Date(dateTimeString),
                showPrice,
                occupiedSeats: {},
              },
            },
            upsert: true,
          },
        });
      });
    });

    if (showsToCreate.length) {
      await Show.bulkWrite(showsToCreate);
    }

    res.json({ success: true, message: "Show Added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Build a map keyed by movie _id to de-duplicate entries.
    const uniqueMoviesMap = new Map();
    shows.forEach((show) => {
      const movieDoc = show.movie;
      if (movieDoc && !uniqueMoviesMap.has(movieDoc._id)) {
        uniqueMoviesMap.set(movieDoc._id, movieDoc);
      }
    });

    res.json({ success: true, shows: Array.from(uniqueMoviesMap.values()) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    // get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete a show (admin only)
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    // Delete the show
    await Show.findByIdAndDelete(showId);

    // Optionally, delete associated bookings
    await (
      await import("../models/Booking.js")
    ).default.deleteMany({ show: showId });

    res.json({ success: true, message: "Show deleted" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

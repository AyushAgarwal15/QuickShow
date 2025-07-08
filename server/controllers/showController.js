import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import NowPlaying from "../models/NowPlaying.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
  try {
    // Attempt to pull the list from the NowPlaying singleton document first
    const doc = await NowPlaying.findById("singleton").lean();
    if (doc && Array.isArray(doc.movies) && doc.movies.length) {
      return res.json({ success: true, movies: doc.movies, source: "db" });
    }

    // Fallback – pull every movie we have stored in the Movies collection
    const allMovies = await Movie.find({}).lean();
    if (allMovies.length) {
      return res.json({
        success: true,
        movies: allMovies,
        source: "movie_collection",
      });
    }

    return res.json({ success: false, message: "No movies available." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    // Ensure movie exists (create if missing) – same logic as before
    let movie = await Movie.findById(movieId);
    if (!movie) {
      const nowDoc = await NowPlaying.findById("singleton").lean();
      const movieEntry = nowDoc?.movies?.find((m) => String(m.id) === String(movieId));
      if (!movieEntry) {
        return res.json({ success: false, message: "Movie not found in database." });
      }
      movie = await Movie.create({
        _id: String(movieEntry.id),
        title: movieEntry.title,
        overview: movieEntry.overview || "",
        poster_path: movieEntry.poster_path || "",
        backdrop_path: movieEntry.backdrop_path || "",
        release_date: movieEntry.release_date || "",
        original_language: movieEntry.original_language || "",
        tagline: movieEntry.tagline || "",
        vote_average: movieEntry.vote_average || 0,
        runtime: movieEntry.runtime || 0,
        genres: movieEntry.genres || [],
        casts: movieEntry.casts || [],
      });
    }

    // Build update object for schedule map
    const scheduleUpdates = {};
    showsInput.forEach((show) => {
      const date = show.date; // YYYY-MM-DD
      show.time.forEach((time) => {
        const timeKey = time; // HH:mm (from front-end)
        if (!scheduleUpdates[date]) scheduleUpdates[date] = {};
        scheduleUpdates[date][timeKey] = { showPrice, occupiedSeats: {} };
      });
    });

    const updateOps = {};
    Object.entries(scheduleUpdates).forEach(([d, timesObj]) => {
      Object.entries(timesObj).forEach(([t, payload]) => {
        updateOps[`schedule.${d}.${t}`] = payload;
      });
    });

    await Show.findOneAndUpdate(
      { movie: movieId },
      { $setOnInsert: { movie: movieId }, $set: updateOps },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Show schedule updated." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({}).populate("movie");

    const now = new Date();

    const response = shows.map((doc) => {
      let earliest = null;
      let price = 0;
      let occCount = 0;
      Object.entries(doc.schedule || {}).forEach(([date, timeMap]) => {
        Object.entries(timeMap || {}).forEach(([timeStr, payload]) => {
          const dt = new Date(`${date}T${timeStr}:00.000Z`);
          if (dt >= now && (!earliest || dt < earliest)) {
            earliest = dt;
            price = payload.showPrice;
          }
          occCount += Object.keys(payload.occupiedSeats || {}).length;
        });
      });
      return {
        _id: doc._id,
        movie: doc.movie,
        showDateTime: earliest,
        showPrice: price,
        occupiedSeats: occCount,
        schedule: doc.schedule,
      };
    });

    const uniqueMoviesMap = new Map();
    response.forEach((item) => {
      const movieDoc = item.movie;
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

    const showDoc = await Show.findOne({ movie: movieId });
    const movie = await Movie.findById(movieId);
    if (!showDoc || !movie) {
      return res.json({ success: false, message: "Show not found" });
    }

    const dateTime = {};
    Object.entries(showDoc.schedule || {}).forEach(([date, timeMap]) => {
      dateTime[date] = Object.entries(timeMap || {}).map(([timeStr, payload]) => ({
        time: `${date}T${timeStr}:00.000Z`, // full ISO for front-end
        timeStr,
        showPrice: payload.showPrice,
      }));
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
    const { showId } = req.params; // here showId is movie's Show document id

    await Show.findByIdAndDelete(showId);

    // Optionally, cascade delete bookings for this movie
    await (
      await import("../models/Booking.js")
    ).default.deleteMany({ movie: showId });

    res.json({ success: true, message: "Show deleted" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";

// Function to check availability of selected seats for a movie schedule slot
const checkSeatsAvailability = async (movieId, date, time, selectedSeats) => {
  const showDoc = await Show.findOne({ movie: movieId });
  if (!showDoc) return false;
  const slot = showDoc.schedule?.[date]?.[time];
  if (!slot) return false;
  const occupiedSeats = slot.occupiedSeats || {};
  return !selectedSeats.some((s) => occupiedSeats[s]);
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req;
    const { movieId, date, time, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Validate availability
    const isAvailable = await checkSeatsAvailability(movieId, date, time, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "Selected Seats are not available." });
    }

    const showDoc = await Show.findOne({ movie: movieId }).populate("movie");
    const slot = showDoc.schedule[date][time];

    const amount = slot.showPrice * selectedSeats.length;

    // Create Booking
    const booking = await Booking.create({
      user: userId,
      movie: movieId,
      date,
      time,
      amount,
      bookedSeats: selectedSeats,
    });

    // Mark seats as occupied
    selectedSeats.forEach((seat) => {
      slot.occupiedSeats[seat] = userId;
    });
    // Reflect updates in nested map
    showDoc.markModified("schedule");
    await showDoc.save();

    // Stripe
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: showDoc.movie.title },
            unit_amount: Math.floor(amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { bookingId: booking._id.toString() },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    booking.paymentLink = session.url;
    await booking.save();

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { movieId, date, time } = req.params;
    const showDoc = await Show.findOne({ movie: movieId });
    const slot = showDoc?.schedule?.[date]?.[time];
    if (!slot) return res.json({ success: true, occupiedSeats: [] });
    const occupiedSeats = Object.keys(slot.occupiedSeats || {});
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

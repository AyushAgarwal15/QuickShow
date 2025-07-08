import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    movie: {type: String, required: true, ref: 'Movie'},
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean,  default:false},
    paymentLink: {type: String},
},{timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String }, 
  userName: { type: String },
  service: { type: String, required: true },
  duration: { type: String },
  place: { type: String },
  address: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: String },
  paymentMethod: { type: String },
  staffId: { type: String },
  staff: { type: Object },
  status: { type: String, default: "upcoming" },
});

appointmentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.model("Appointment", appointmentSchema);

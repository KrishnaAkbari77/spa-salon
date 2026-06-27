import mongoose from "mongoose";

if (mongoose.models.Staff) {
  delete mongoose.models.Staff;
}

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
  serviceKey: { type: String },
  achievement: { type: String },
}, { strict: false });

staffSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.model("Staff", staffSchema);

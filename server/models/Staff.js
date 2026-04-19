import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true }
});

staffSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model('Staff', staffSchema);

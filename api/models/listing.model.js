import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rewardvalue: {
      type: Number,
      required: true,
    },
    all: {
      type: Boolean,
      required: true,
    },
    computer: {
      type: Boolean,
      required: true,
    },
    it: {
        type: Boolean,
        required: true,
      },
    mechanical: {
        type: Boolean,
        required: true,
      },
    extc: {
        type: Boolean,
        required: true,
      },
    electrical: {
        type: Boolean,
        required: true,
      },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
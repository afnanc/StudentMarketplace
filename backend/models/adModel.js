const mongoose = require("mongoose");

// Schema for an ad
const adSchema = new mongoose.Schema({
  title: {
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
    enum: [
      "Arts",
      "Electronics",
      "Furniture",
      "Fashion",
      "Sports",
      "Kids",
      "Business",
      "Health",
      "Automotive",
      "Education",
      "Kitchen",
      "Outdoor",
      "Other",
    ],
  },
  price: {
    type: Number,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Items For Sale", "Items Wanted", "Academic Services"],
  },
  location: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    default: Date.now,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  photos: {
    type: [String],
  },
});

// Model for an ad
const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;

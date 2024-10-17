const adModel = require("../models/adModel");
const multer = require("multer");
const path = require("path");

// THANK YOU BEYONCE
// Controller File for handling API requests related to ads
// Function to create an ad
const createAd = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files) {
      photoUrls = req.files.map((file) => {
        return `/img/${file.filename}`;
      });
    }

    // Handle photos
    const adData = {
      ...req.body,
      photos: photoUrls,
    };

    const ad = await adModel.create(adData);

    res.status(201).json(ad);
    console.log("Ad created successfully");
  } catch (error) {
    res.status(500).json({ error: "Failed to create ad" });
    console.error(error);
  }
};

// Function to get all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await adModel.find();
    res.status(200).json(ads);
    console.log("All ads retrieved successfully");
  } catch (error) {
    res.status(500).json({ error: "Failed to get ads" });
  }
};

// Function to get an ad by ID
const getAdById = async (req, res) => {
  try {
    const ad = await adModel.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    res.status(200).json(ad);
    console.log("Ad retrieved successfully");
  } catch (error) {
    res.status(500).json({ error: "Failed to get ad" });
  }
};

// Function to update an ad by ID
const updateAdById = async (req, res) => {
  try {
    const ad = await adModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ad) {
      console.log("Ad not found");
      return res.status(404).json({ error: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ad" });
  }
};

// Function to delete an ad by ID
const deleteAdById = async (req, res) => {
  try {
    const ad = await adModel.findByIdAndDelete(req.params.id);
    if (!ad) {
      console.log("Ad not found");
      return res.status(404).json({ error: "Ad not found" });
    }
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ad" });
  }
};

// Function to get the most viewed ads
const mostViewedAds = async (req, res) => {
  try {
    const ad = await adModel.find().sort({ view_count: -1 }).limit(10);

    if (ad.length === 0) {
      return res.status(404).json({ error: "No ads found" });
    }

    res.status(200).json(ad);
    console.log("Most viewed ads retrieved successfully");
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve most viewed ads" });
  }
};

// Function to filter ads based on query parameters
const filterAds = async (req, res) => {
  try {
    // Get query parameters
    const {
      minPrice,
      maxPrice,
      location,
      type,
      category,
      username,
      title,
      sortBy,
    } = req.query;

    let query = {};
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (location) query.location = location;
    if (type) query.type = type;
    if (category) query.category = category;
    if (username) query.username = username;
    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }

    // Sort options
    let sortOptions = {};
    if (sortBy) {
      if (sortBy === "newest") {
        sortOptions.date_posted = -1;
      } else if (sortBy === "oldest") {
        sortOptions.date_posted = 1;
      } else if (sortBy === "cheapest") {
        sortOptions.price = 1;
      } else if (sortBy === "expensive") {
        sortOptions.price = -1;
      }
    }

    // Find ads based on query parameters
    const ads = await adModel.find(query).sort(sortOptions);

    if (ads.length === 0) {
      return res
        .status(404)
        .json({ error: "No ads found matching the specified filters" });
    }

    res.status(200).json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to filter ads" });
  }
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Multer upload function
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
}).array("photos", 3);

// Function to get the count of ads by category
const getAdCountByCategory = async (req, res) => {
  try {
    const count = await adModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    if (!count.length) {
      return res.status(404).json({ error: "0" });
    }

    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

// Export functions
module.exports = {
  createAd,
  getAllAds,
  getAdById,
  updateAdById,
  deleteAdById,
  mostViewedAds,
  filterAds,
  upload,
  getAdCountByCategory,
};

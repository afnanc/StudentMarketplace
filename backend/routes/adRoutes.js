const express = require("express");
const adController = require("../controllers/adController");
const { upload } = adController;

// Router for handling API requests related to ads
const router = express.Router();

// Routes
router.post("/", upload, adController.createAd);
router.get("/", adController.getAllAds);
router.get("/filter", adController.filterAds);
router.get("/top-10/mostViewedAds", adController.mostViewedAds);
router.get("/count/adCountByCategory", adController.getAdCountByCategory);
router.get("/:id", adController.getAdById);
router.patch("/:id", adController.updateAdById);
router.delete("/:id", adController.deleteAdById);

module.exports = router;

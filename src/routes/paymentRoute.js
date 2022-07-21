const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middleware/verifyAuth");

router.post("/process", isAuthenticatedUser, paymentController.processPayment);
router.get(
  "/stripe-api-key",
  isAuthenticatedUser,
  paymentController.sendStripeApiKey
);

module.exports = router;

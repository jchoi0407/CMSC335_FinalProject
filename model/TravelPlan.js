const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    budgetAmount: {
        type: Number,
        required: true,
    },
    budgetCurrency: {
        type: String,
        required: true,
    },
    desCurrency: {
        type: String,
        required: true,
    },
    flightCost: {
        type: Number,
        required: true,
    },
    hotelCost: {
        type: Number,
        required: true,
    },
    otherCost: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    convertedTotal: {
        type: Number,
        required: true,
    },
    conversionRate: { 
        type: Number,
        reuqired: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
   
});

const TravelPlan = mongoose.model("TravelPlan", plansSchema);
module.exports = TravelPlan;

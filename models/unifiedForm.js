const mongoose = require('mongoose');

const unifiedFormSchema = new mongoose.Schema({
    formType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    city: { type: String },
    companyName: { type: String },
    typeOfBusiness: { type: String },
    budget: { type: String },
    advertiseMessage: { type: String },
    distributionPoint: { type: String },
    shippingAddress: { type: String },
    footTraffic: { type: String },
    ageRange: { type: String },
    beveragesPerMonth: { type: String },
    reason: { type: String },
    subject: { type: String },
    message: { type: String },
    isForEvent: { type: Boolean, default: false },
    agreeToShare: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('UnifiedForm', unifiedFormSchema);

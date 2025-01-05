const mongoose = require('mongoose');

const crypto = require("crypto");

const shortUrlSchema = new mongoose.Schema({
    originalUrl: {type: String, required: true},
    sortUrl: {type: String, required: true,default: () => crypto.randomUUID()},
    clicks: {type: Number, required: true, default: 0}
})

module.exports = mongoose.model('shortUrl', shortUrlSchema);
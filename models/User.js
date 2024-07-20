const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dsovs75ml/image/upload/v1721291252/download_u61zrf.jpg"
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    code: {
        type: Boolean,
    },



}, { timestamps: true })

module.exports = mongoose.models.user || mongoose.model("user", userSchema)


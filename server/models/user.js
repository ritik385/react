const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema.Types
const { Schema } = mongoose;
// const userSchema =new mongoose.Schema()




const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true // Email should be unique
    },
    password: {
        type: String,
        required: true // Password is required
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: "https://res.cloudinary.com/dwdcrmv57/image/upload/v1712210864/txaklidmvquesohnkveb.jpg"
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of User references for followers
    following: [{ type: Schema.Types.ObjectId, ref: "User" }] // Array of User references for following
});

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;

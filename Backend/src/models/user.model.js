import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;

import mongoose from 'mongoose';
import Contact from "./contact.model";
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: String,
    token: String,
    refreshToken: String,
    image: String,
    googleId: String,
    contacts: [Contact]
});

export default User;
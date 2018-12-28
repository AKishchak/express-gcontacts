import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Contact = new Schema({
    name: String,
    phone: [String],
    email: [String],
    googleRef: String
});

export default Contact;
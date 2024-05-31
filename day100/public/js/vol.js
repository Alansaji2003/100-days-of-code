import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
});

const Volunteer= mongoose.model('Volunteer', VolunteerSchema);

export default Volunteer;

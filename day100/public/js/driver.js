import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    email: { type: String, required: true  },
    firstName: { type: String, required: true  },
    lastName: { type: String, required: true  },
    password: { type: String, required: true },
});

const Driver= mongoose.model('Driver', DriverSchema);

export default Driver;

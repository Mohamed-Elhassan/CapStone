const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    hiitWorkout: {
        type: String,
        required: true
    },
    bodybuildingWorkout: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Workout', workoutSchema);
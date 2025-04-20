const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedWorkoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutType: {
        type: String,
        required: true,
        enum: ['HIIT', 'Bodybuilding']
    },
    content: {
        type: String,
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SavedWorkout', savedWorkoutSchema); 
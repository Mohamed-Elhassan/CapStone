const mongoose = require('mongoose');
const Workout = mongoose.model('Workout');

const getTodaysWorkout = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const workout = await Workout.findOne({ date: today });

        if (!workout) {
            return res.status(404).json({
                message: "No workouts found for today"
            });
        }

        res.status(200).json({
            HIIT_workout_of_the_day: workout.hiitWorkout,
            Bodybuilding_workout_of_the_day: workout.bodybuildingWorkout
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getTodaysWorkout
};
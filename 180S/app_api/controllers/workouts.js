const mongoose = require('mongoose');
const Workout = mongoose.model('Workout');
const SavedWorkout = require('../models/savedWorkout');

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

const saveWorkout = async (req, res) => {
    try {
        const { workoutType, content } = req.body;
        const savedWorkout = new SavedWorkout({
            user: req.user._id,
            workoutType,
            content
        });
        await savedWorkout.save();
        res.status(201).json({ message: 'Workout saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving workout' });
    }
};

const getSavedWorkouts = async (req, res) => {
    try {
        const savedWorkouts = await SavedWorkout.find({ user: req.user._id })
            .sort({ savedAt: -1 });
        res.json(savedWorkouts);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving saved workouts' });
    }
};

const deleteSavedWorkoutByType = async (req, res) => {
    try {
        const workout = await SavedWorkout.findOneAndDelete({
            workoutType: req.params.workoutType,
            user: req.user._id
        });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting workout' });
    }
};

const deleteSavedWorkoutById = async (req, res) => {
    try {
        const workout = await SavedWorkout.findOneAndDelete({
            _id: req.params.workoutId,
            user: req.user._id
        });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting workout' });
    }
};

module.exports = {
    getTodaysWorkout,
    saveWorkout,
    getSavedWorkouts,
    deleteSavedWorkoutByType,
    deleteSavedWorkoutById
};
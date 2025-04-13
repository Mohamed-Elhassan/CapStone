const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

/**
 * GET: /trips - Lists all trips
 */
const tripsList = async (req, res) => {
    try {
        const q = await Model.find({}).exec();
        console.log(q);

        if (!q || q.length === 0) {
            return res.status(404).json({ error: "No trips found" });
        }
        return res.status(200).json(q);
    } catch (err) {
        console.error("❌ Error fetching trips:", err);
        return res.status(500).json({ error: "Server error", details: err });
    }
};

/**
 * GET: /trips/:tripCode - Get a single trip by code
 */
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model.find({ code: req.params.tripCode }).exec();
        console.log(q);

        if (!q || q.length === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }
        return res.status(200).json(q);
    } catch (err) {
        console.error("❌ Error fetching trip:", err);
        return res.status(500).json({ error: "Server error", details: err });
    }
};

/**
 * POST: /trips - Adds a new Trip (Authentication Required)
 */
const tripsAddTrip = async (req, res) => {
    console.log("🔍 Debug: req.user =", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    try {
        const newTrip = new Trip(req.body);
        const savedTrip = await newTrip.save();
        console.log("✅ Trip added:", savedTrip);
        return res.status(201).json(savedTrip);
    } catch (err) {
        console.error("❌ Error adding trip:", err);
        return res.status(400).json(err);
    }
};

/**
 * PUT: /trips/:tripCode - Updates a Trip (Authentication Required)
 */
const tripsUpdateTrip = async (req, res) => {
    console.log("🔍 Debug: req.user =", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    try {
        const updatedTrip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            req.body,
            { new: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({ message: `Trip not found with code ${req.params.tripCode}` });
        }

        console.log("✅ Trip updated:", updatedTrip);
        return res.status(200).json(updatedTrip);
    } catch (err) {
        console.error("❌ Error updating trip:", err);
        return res.status(500).json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};

const fetch = require('node-fetch'); // Import fetch for API requests

/* GET Travel view */
const travel = async (req, res) => {
    try {
        console.log("Fetching trips from API..."); // Debugging message

        // Fetch trip data from API
        const response = await fetch('http://localhost:3000/api/trips');
        const trips = await response.json(); // Convert response to JSON

        console.log("Trips received:", trips); // Debugging message

        // ✅ Handle cases where API response is not valid
        if (!Array.isArray(trips)) {
            console.error("API Error: Response is not an array");
            return res.render('travel', { 
                title: "Travlr Getaways", 
                trips: [], 
                error: "Unexpected data format from API." 
            });
        }

        // ✅ Handle case where API response is an empty array (no trips found)
        if (trips.length === 0) {
            console.warn("API Warning: No trips found in the database.");
            return res.render('travel', { 
                title: "Travlr Getaways", 
                trips: [], 
                error: "No trips available at this time. Please check back later!" 
            });
        }

        // Render the travel page with the fetched trips
        res.render('travel', { title: "Travlr Getaways", trips });

    } catch (err) {
        console.error("API Fetch Error:", err);

        // Render the page with an error message
        res.render('travel', { 
            title: "Travlr Getaways", 
            trips: [], 
            error: "Unable to retrieve trips. Please try again later." 
        });
    }
};

module.exports = { travel };

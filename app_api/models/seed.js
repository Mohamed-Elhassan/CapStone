//Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');
const MealPlan = require('./mealPlan');

//Read seed data from json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json','utf-8'))
var mealplans = JSON.parse(fs.readFileSync('./data/mealplans.json','utf-8'))


//Delete any existing records, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
    await MealPlan.deleteMany({});
    mealplans.forEach(item => {
        if (item._id && item._id.$oid) {
            item._id = new Mongoose.Types.ObjectId(item._id.$oid);
          }

        if (item.pdfData && item.pdfData.$binary) {
          item.pdfData = Buffer.from(item.pdfData.$binary.base64, 'base64');
        }
      });
    await MealPlan.insertMany(mealplans);
};

//Close the MongoDB connection and exit
seedDB().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
});
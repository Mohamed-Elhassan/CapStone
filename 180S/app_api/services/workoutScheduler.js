const cron = require('node-cron');
const mongoose = require('mongoose');
const Workout = mongoose.model('Workout');
const OpenAI = require('openai');

// Clean the API key by removing all non-ASCII characters
const cleanApiKey = process.env.OPENAI_API_KEY.replace(/[^\x00-\x7F]/g, '');

const openai = new OpenAI({
  apiKey: cleanApiKey
});

async function getWorkoutsFromOpenAI() {
  try {
    console.log('Attempting to generate HIIT workout...');
    const HIITresponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional fitness instructor." },
        { role: "user", content: "Provide a HIIT style workout of the day for intense fitness with a warm-up and cool-down. Include sets and repetitions. Duration should be at least between 30min-45min. Dont include hashtags or asterisks and start the statement as \"Today's HIIT Workout\"" }
      ]
    });
    console.log('HIIT workout generated successfully');

    console.log('Attempting to generate Bodybuilding workout...');
    const BBresponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional fitness instructor." },
        { role: "user", content: "Today is (check current day of the week). Provide a single workout following this schedule (Monday: Chest, Tuesday: Legs, Wednesday: Back, Thursday: Shoulders/Arms, Friday: Cardio/Abs, Saturday: Active recovery or light cardio, Sunday: Rest or stretching), including a warm-up, 5 main exercises with sets and reps of 4 x 8, when its thursday shoulders/arms make sure there are 4 movements for both shoulders and arms respectively and abs/cardio make sure there are 4 ab movements. a cool-down, focusing only on today's workout without listing all the days or using hashtags or asterisks. start the statement as \"Today's Bodybuilding Workout\"" }
      ]
    });
    console.log('Bodybuilding workout generated successfully');

    return {
      HIIT_workout_of_the_day: HIITresponse.choices[0].message.content.trim(),
      Bodybuilding_workout_of_the_day: BBresponse.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('Error in getWorkoutsFromOpenAI:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status
    });
    throw error; // Re-throw to be handled by the caller
  }
}

async function generateAndStoreWorkout() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Checking for existing workout for date:', today);

    const existingWorkout = await Workout.findOne({ date: today });
    console.log('Existing workout check result:', existingWorkout ? 'Found' : 'Not found');

    // Check if the existing workout is sample text
    const isSampleText = existingWorkout && 
      (existingWorkout.hiitWorkout.includes('Sample HIIT Workout') || 
       existingWorkout.bodybuildingWorkout.includes('Sample Bodybuilding Workout'));

    if (!existingWorkout || isSampleText) {
      console.log('No valid workout found, generating new workouts...');
      const data = await getWorkoutsFromOpenAI();

      const workout = new Workout({
        date: today,
        hiitWorkout: data.HIIT_workout_of_the_day,
        bodybuildingWorkout: data.Bodybuilding_workout_of_the_day
      });

      await workout.save();
      console.log('New workouts generated and saved for', today);
    } else {
      console.log('Using existing workout for', today);
    }
  } catch (err) {
    console.error('Error in generateAndStoreWorkout:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack
    });
  }
}

// Schedule task to run at midnight every day
cron.schedule('0 0 * * *', generateAndStoreWorkout);

// Run immediately on startup
console.log('Starting workout scheduler...');
generateAndStoreWorkout(); 
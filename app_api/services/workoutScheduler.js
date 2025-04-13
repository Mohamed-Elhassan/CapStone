const cron = require('node-cron');
const mongoose = require('mongoose');
const Workout = mongoose.model('Workout');
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: "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"  // Use .env to hide the key
});

async function getWorkoutsFromOpenAI() {
  const HIITresponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional fitness instructor." },
      { role: "user", content: "Provide a HIIT style workout of the day for intense fitness with a warm-up and cool-down. Include sets and repetitions. Duration should be at least between 30min-45min. Dont include hashtags or asterisks and start the statement as \"Today's HIIT Workout\"" }
    ]
  });

  const BBresponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional fitness instructor." },
      { role: "user", content: "Today is (check current day of the week). Provide a single workout following this schedule (Monday: Chest, Tuesday: Legs, Wednesday: Back, Thursday: Shoulders/Arms, Friday: Cardio/Abs, Saturday: Active recovery or light cardio, Sunday: Rest or stretching), including a warm-up, 5 main exercises with sets and reps of 4 x 8, when its thursday shoulders/arms make sure there are 4 movements for both shoulders and arms respectively and abs/cardio make sure there are 4 ab movements. a cool-down, focusing only on today's workout without listing all the days or using hashtags or asterisks. start the statement as \"Today's Bodybuilding Workout\"" }
    ]
  });

  return {
    HIIT_workout_of_the_day: HIITresponse.choices[0].message.content.trim(),
    Bodybuilding_workout_of_the_day: BBresponse.choices[0].message.content.trim()
  };
}


async function generateAndStoreWorkout() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const existingWorkout = await Workout.findOne({ date: today });
  
      if (!existingWorkout) {
        const data = await getWorkoutsFromOpenAI();
  
        const workout = new Workout({
          date: today,
          hiitWorkout: data.HIIT_workout_of_the_day,
          bodybuildingWorkout: data.Bodybuilding_workout_of_the_day
        });
  
        await workout.save();
        console.log('New workouts generated for', today);
      }
    } catch (err) {
      console.error('Error generating workouts:', err);
    }
  }
  

// Schedule task to run at midnight every day
cron.schedule('0 0 * * *', generateAndStoreWorkout);

// Run immediately on startup, make call to Flask API if no workout exists for today
generateAndStoreWorkout(); 
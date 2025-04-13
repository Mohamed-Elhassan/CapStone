from flask import Flask, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)

CORS(app)

openai.api_key = "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" 

# current_day = datetime.now().strftime('%A') # Return the current day of the week

@app.route('/workout_of_the_day', methods=['GET'])
def workout_of_the_day():
    # First request: HIIT workout using GPT-4oMini (or other similar model)
    HIITresponse = openai.chat.completions.create(
        model="gpt-4o-mini",  # Use GPT-4oMini for this request
        messages=[
            {"role": "system", "content": "You are a professional fitness instructor."},
            {"role": "user", "content": "Provide a HIIT style workout of the day for intense fitness with a warm-up and cool-down. Include sets and repetitions. Duration should be at least between 30min-45min. Dont include hashtags or asterisks and start the statement as \"Today's HIIT Workout\""}
        ]
    )
    
    # Second request: Bodybuilding workout using GPT-4oMini (or other similar model)
    BBresponse = openai.chat.completions.create(
        model="gpt-4o-mini",  # Use GPT-4oMini for this request
        messages=[
            {"role": "system", "content": "You are a professional fitness instructor."},
            {"role": "user", "content": "Today is (check current day of the week). Provide a single workout following this schedule (Monday: Chest, Tuesday: Legs, Wednesday: Back, Thursday: Shoulders/Arms, Friday: Cardio/Abs, Saturday: Active recovery or light cardio, Sunday: Rest or stretching), including a warm-up, 5 main exercises with sets and reps of 4 x 8, when its thursday shoulders/arms make sure there are 4 movements for both shoulders and arms respectively and abs/cardio make sure there are 4 ab movements. a cool-down, focusing only on today's workout without listing all the days or using hashtags or asterisks. start the statement as \"Today's Bodybuilding Workout\""}
        ]
    )
    
    # Extract workout text from both responses
    HIITworkout = HIITresponse.choices[0].message.content.strip()
    BBworkout = BBresponse.choices[0].message.content.strip()


    # Return both workouts as a JSON response
    return jsonify({
        "HIIT_workout_of_the_day": HIITworkout,
        "Bodybuilding_workout_of_the_day": BBworkout
    })

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# load .env into environment
load_dotenv()

# grab your key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

def workout_of_the_day():
    # HIIT workout
    HIITresponse = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional fitness instructor."},
            {
                "role": "user",
                "content": (
                    "Provide a HIIT style workout of the day for intense fitness with a "
                    "warm-up and cool-down. Include sets and repetitions. Duration should "
                    "be between 30min-45min. Don’t include hashtags or asterisks and start "
                    "the statement as \"Today's HIIT Workout\""
                )
            }
        ]
    )

    # Bodybuilding workout
    BBresponse = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional fitness instructor."},
            {
                "role": "user",
                "content": (
                    "Today is (check current day of the week). Provide a single workout "
                    "following this schedule (Monday: Chest, Tuesday: Legs, Wednesday: Back, "
                    "Thursday: Shoulders/Arms, Friday: Cardio/Abs, Saturday: Active recovery "
                    "or light cardio, Sunday: Rest or stretching), including a warm-up, 5 "
                    "main exercises with sets and reps of 4 x 8. When it’s Thursday "
                    "Shoulders/Arms make sure there are 4 movements for both shoulders and "
                    "arms respectively and abs/cardio make sure there are 4 ab movements. A "
                    "cool-down, focusing only on today's workout without listing all the days "
                    "or using hashtags or asterisks. Start the statement as \"Today's "
                    "Bodybuilding Workout\""
                )
            }
        ]
    )

    HIITworkout = HIITresponse.choices[0].message.content.strip()
    BBworkout = BBresponse.choices[0].message.content.strip()

    return jsonify({
        "HIIT_workout_of_the_day": HIITworkout,
        "Bodybuilding_workout_of_the_day": BBworkout
    })

@app.route('/workout_of_the_day', methods=['GET'])
def get_workout():
    return workout_of_the_day()

if __name__ == "__main__":
    app.run(debug=True)

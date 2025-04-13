#!/usr/bin/env node

const fs = require('fs');
const mongoose = require('mongoose');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Create the meal plan schema
const mealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  pdfData: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    default: 'application/pdf'
  },
  effortLevel: {
    type: String,
    required: true,
    enum: ['No Effort', 'Low Effort', 'Full Effort']
  }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1/travlr');
    console.log('Connected to MongoDB');
    
    // Get user input
    const name = await question('Enter meal plan name: ');
    const calories = Number(await question('Enter calories: '));
    const fat = Number(await question('Enter fat (g): '));
    const carbs = Number(await question('Enter carbs (g): '));
    const protein = Number(await question('Enter protein (g): '));
    const effortLevel = await question('Enter effort level (No Effort, Low Effort, Full Effort): ');
    const pdfPath = await question('Enter path to PDF file: ');
    
    // Validate PDF path
    if (!fs.existsSync(pdfPath)) {
      console.error('Error: PDF file does not exist');
      rl.close();
      mongoose.connection.close();
      return;
    }
    
    // Read PDF file
    const pdfData = fs.readFileSync(pdfPath);
    
    // Create meal plan document
    const mealPlan = new MealPlan({
      name,
      calories,
      fat,
      carbs,
      protein,
      pdfData,
      contentType: 'application/pdf',
      effortLevel
    });
    
    // Save to database
    const savedMealPlan = await mealPlan.save();
    console.log('Meal plan added successfully!');
    console.log('ID:', savedMealPlan._id);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connections
    rl.close();
    mongoose.connection.close();
  }
}

main();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./db');

const app = express();
const PORT = 3001;

// MongoDB schema
const enrollmentSchema = new mongoose.Schema({
  name: {type: String, unique: true, required: true},
  pass: String,
  age: Number,
  batch: String,
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Middleware
app.use(bodyParser.json());

// API to enroll participants
app.post('/api/enroll', async (req, res) => {
  const { name,pass, age, selectedBatch } = req.body;


  // Basic validation
  if (!name || !pass || !age || !selectedBatch) {
    return res.status(400).json({ success: false, message: 'Incomplete data' });
  }

  try {
    // Create a new enrollment document
    const enrollment = new Enrollment({
      name,
      pass,
      age,
      batch: selectedBatch,
      fees_details : []
    });

    
    // Save the document to MongoDB
    await enrollment.save();

    return res.json({ success: true, message: 'Enrollment successful', 'Access-Control-Allow-Origin' : 'http://localhost:3000',
    'Access-Control-Allow-Credentials' : true,
    'Access-Control-Allow-Methods' :  'POST',
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/authenticate', async (req, res) => {
  const { name, pass } = req.body;
console.log(name,pass);
  try {
    // Find the user in the database
    const user = await Enrollment.findOne({name, pass });

    if (user) {
      // Authentication successful
      res.json({ success: true, message: 'Authentication successful' });
    } else {
      // Authentication failed
      res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/getUser', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    const enrollment = await Enrollment.findOne({ name });

    if (!enrollment) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Mock function to complete payment (you don't need to implement this)
function CompletePayment(name, pass, age, batch) {
  // Your logic to complete the payment goes here
  // Return true if payment is successful, false otherwise
  return { success: true, message: 'Payment successful' };
}

// Endpoint to complete payment
app.post('/api/completePayment', (req, res) => {
  const { name, pass, age, batch } = req.body;

  // Call the mock function to complete the payment
  const paymentResult = completePayment(name, pass, age, batch);

  // Send the payment result as JSON response
  res.json(paymentResult);
});

app.post('/api/submitForm', async (req, res) => {
  // TODO: Implement validation and store data in the database
  // Mock response for now
  const paymentResponse = CompletePayment(req.body); // Assuming CompletePayment is defined
  res.json({ success: paymentResponse.success, message: paymentResponse.message });
});

// Endpoint to check if a username already exists
app.get('/api/checkUsername', async (req, res) => {
  try {
    const { username } = req.query;

    // Check if the username exists in the database
    const user = await Enrollment.findOne({ name: username });

    // Send the result to the client
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

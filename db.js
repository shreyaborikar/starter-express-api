const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shreyaborikar02:V3DuGNVOrL40qEdP@cluster0.zv4ybma.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

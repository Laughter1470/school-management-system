import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'School Management System Backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
});
=======
}); // Added missing semicolon here
>>>>>>> 07854683804d22caaf68cedc8303951e14e0965f

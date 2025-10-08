import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { Student } from './models/Student';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'School Management System Backend' });
});

// CRUD Endpoints for Students
// Get all students
app.get('/students', async (req, res) => {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    res.json(data as Student[]);
  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error('Error fetching students:', err);
    res.status(500).json({
      error: 'Failed to fetch students',
      details: err.message || 'Unknown error',
    });
  }
});

// Get a single student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(data as Student);
  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error('Error fetching student:', err);
    res.status(500).json({
      error: 'Failed to fetch student',
      details: err.message || 'Unknown error',
    });
  }
});

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const { name, email } = req.body as Omit<Student, 'id'>;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const { data, error } = await supabase
      .from('students')
      .insert({ name, email })
      .select()
      .single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    res.status(201).json(data as Student);
  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error('Error creating student:', err);
    res.status(500).json({
      error: 'Failed to create student',
      details: err.message || 'Unknown error',
    });
  }
});

// Update a student
app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body as Omit<Student, 'id'>;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const { data, error } = await supabase
      .from('students')
      .update({ name, email })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(data as Student);
  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error('Error updating student:', err);
    res.status(500).json({
      error: 'Failed to update student',
      details: err.message || 'Unknown error',
    });
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error('Error deleting student:', err);
    res.status(500).json({
      error: 'Failed to delete student',
      details: err.message || 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

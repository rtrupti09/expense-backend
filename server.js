
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Add Expense
app.post('/api/expenses', async (req, res) => {
  const { amount, description, category, date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO expenses (amount, description, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, description, category, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding expense');
  }
});

// Edit Expense
app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;
  try {
    const result = await db.query(
      'UPDATE expenses SET amount = $1, description = $2, category = $3, date = $4 WHERE id = $5 RETURNING *',
      [amount, description, category, date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Expense not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating expense');
  }
});

// Delete Expense
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Expense not found');
    }
    res.send('Expense deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting expense');
  }
});

// List Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving expenses');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

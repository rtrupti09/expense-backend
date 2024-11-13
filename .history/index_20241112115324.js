const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// Routes
// Add an expense
app.post('/expenses', async (req, res) => {
    const { amount, description, category, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO expenses (amount, description, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [amount, description, category, date || new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit an expense
app.put('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE expenses SET amount = $1, description = $2, category = $3, date = $4 WHERE id = $5 RETURNING *',
            [amount, description, category, date, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an expense
app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

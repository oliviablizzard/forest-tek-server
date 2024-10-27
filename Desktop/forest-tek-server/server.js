import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mysql from 'mysql2/promise';

const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

app.get('/organizations', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM organizations');
        res.status(200).json(rows)
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Server error');
    }
});

app.get('/programs', async (req, res) => {
    const { location } = req.query; // Get the location query parameter

    try {
        let sql = 'SELECT * FROM programs';
        const params = [];

        // Check if a location filter is provided
        if (location) {
            sql += ' WHERE location LIKE ?'; // Use LIKE for partial matching
            params.push(`%${location}%`); // Add wildcards for search
        }

        const [rows] = await pool.query(sql, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).send('Server error');
    }
});

app.put('/organizations', async (req, res) => {
    const { organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area } = req.body;

    if (!organization || !acronym || !contactTitle || !contactNumber || !contactEmail || !webLink || !logo || !area) {
        return res.status(400).send('All fields are required');
    }

    try {
        const sql = `
            INSERT INTO organizations (organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area]);

        res.status(201).send('Organization added successfully');
    } catch (error) {
        console.error('Error adding organization:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`listening at PORT ${PORT}`);
});

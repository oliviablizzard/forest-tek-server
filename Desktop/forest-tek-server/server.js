import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import knex from './knex.js';

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
};

// Route to get organizations
app.get('/organizations', async (req, res) => {
    try {
        const rows = await knex('organizations').select('*');
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to get programs with optional location filter
app.get('/programs', async (req, res) => {
    const location = req.query.location;
    if (!location) {
        return res.status(400).json({ error: 'Location parameter is required.' });
    }

    try {
        const programs = await knex('programs').where('location', 'like', `%${location}%`);
        if (programs.length === 0) {
            return res.status(404).json({ message: 'No programs found.' });
        }
        res.json(programs);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to add a new organization
app.put('/organizations', async (req, res) => {
    const { organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area } = req.body;

    if (!organization || !acronym || !contactTitle || !contactNumber || !contactEmail || !webLink || !logo || !area) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await knex('organizations').insert({ organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area });
        res.status(201).json({ message: 'Organization added successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

// Route to add a program suggestion
app.post('/api/suggestions', async (req, res) => {
    const { programName, institutionName, location, message } = req.body;

    if (!programName || !institutionName || !location || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await knex('suggestions').insert({ program_name: programName, institution_name: institutionName, location, message });
        res.status(201).json({ message: 'Suggestion submitted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

// Route to retrieve all program suggestions
app.get('/api/suggestions', async (req, res) => {
    try {
        const suggestions = await knex('suggestions').select('*');
        res.status(200).json(suggestions);
    } catch (error) {
        handleError(res, error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
});
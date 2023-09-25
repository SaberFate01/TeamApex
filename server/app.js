import express from 'express';

import sequelize from './utils/database.js';

import router from './routes/routes.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


const apiKey = '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';
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Make a request to the ChatGPT API
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: message,
            max_tokens: 50, // Adjust the response length as needed
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`, // Use your OpenAI API key here
            },
        });

        const reply = response.data.choices[0].text;
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Use your existing routes and middleware
app.use(router);
sequelize.sync()
    .then(() => {
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch(err => {
        console.error('Database connection failed: ', err);
    });
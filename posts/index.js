const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    // object destructuring
    const { title } =  req.body;

    //[] => since id is a string, otherwise we would have used .
    posts[id] = {
        id, 
        title
    };
    
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        },
    });

    res.status(201).send(posts[id]);
});

// Receiving event from event bus
app.post('/events', (req, res) => {
    console.log('Event received', req.body.type);
    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});
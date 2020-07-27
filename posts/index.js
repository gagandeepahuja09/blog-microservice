const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    console.log('trewt');
    const id = randomBytes(4).toString('hex');
    // object destructuring
    const { title } =  req.body;

    //[] => since id is a string, otherwise we would have used .
    posts[id] = {
        id, 
        title
    };
    console.log("title", id, title);
    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});
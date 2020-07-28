const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({
         id: commentId, 
         content 
    });
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'commentCreated',
        data: {
            id: commentId,
            comment,
            postId: req.params.id,
        }
    });
    res.status(201).send(comments);
}); 

app.listen(4001, () => {
    console.log('Listening on 4001');
})
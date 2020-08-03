const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'postCreated') {
        const { id, title } = data;
        console.log(id, title);
        posts[id] = { id, title, comments: [] };
    }

    if(type === 'commentCreated') {
        const { id, content, postId, status } = data;
        console.log(id, content, postId);
        const post = posts[postId].comments;
        post.push({ 
            id,
            content,
            status
        });
    }

    if(type === 'commentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return (comment.id === id);
        });
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    // When the service comes online
    const res = await axios.get('http://event-bus-srv:4005/events');
    for(let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
});
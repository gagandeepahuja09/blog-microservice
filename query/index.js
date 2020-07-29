const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

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

    console.log(posts);

    res.send({});
});

app.listen(4002, () =>{
    console.log('Listening on port 4002');
});
import React from 'react';

export default ({ comments }) => {
    const renderedComments = comments.map(comment => {
        let content = comment.content;
        if(comment.status === 'pending') {
            content = 'This comment is under supervision';
        }
        if(comment.status === 'denied') {
            content = 'This comment is flagged as inappropriate';
        }
        console.log(comment.status, content);
        return <li key={comment.id}>{content}</li>
    });
    
    return <ul>
            {renderedComments}
        </ul>
};
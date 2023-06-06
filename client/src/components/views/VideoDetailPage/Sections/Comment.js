import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';// redux hook
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const videoId = props.postId;// url에서 정보를 가져옴

    const user = useSelector(state => state.user);// state에서 user정보를 가져와서 user 변수에 넣음
    const [commentValue, setcommentValue] = useState("");

    const handleChange = (event) => {
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,// Redux에서 정보를 가져옴
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if (response.data.success) {
                props.refreshFunction(response.data.result);
                setcommentValue("");
            } else {
                alert('Failed to save comment');
            }
        })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {props.commentLists && props.commentLists.map((comment, index) => {
                return (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment commentLists={props.commentLists} parentCommentId={comment._id}
                            refreshFunction={props.refreshFunction} postId={videoId}/>
                    </React.Fragment>
                )// responseTo가 없는 댓글만 depth 없이 화면에 출력
            })}

            <form style={{ display: 'flex', marginTop:'40px' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="Write a comment here" 
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment;
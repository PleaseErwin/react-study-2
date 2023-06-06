import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import { PromiseProvider } from 'mongoose';

function LikeDislikes(props) {

    let variable = {}

    if (props.video) {
        // variable = { userId: , videoId: }
    }

    useEffect(() => {// 현재 좋아요 싫어요에 대한 정보를 DB에서 가져오기
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if (response.data.success) {// response.data = Object 형태
                setVideoDetail(response.data.videoDetail);
            } else {
                alert('Failed to play video');
            }
        })
    }, []);

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme="filled"
                        onClick                    
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> 1 </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme="outlined"
                        onClick                    
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> 1 </span>
            </span>
        </div>
    )
}

export default LikeDislikes;
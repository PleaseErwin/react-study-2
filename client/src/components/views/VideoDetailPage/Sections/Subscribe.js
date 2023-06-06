import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    let variable = {
        userTo: props.userTo// VideoDetailPage.js에서 props으로 넘겨줌
    }
    let subscribedVariable = {
        userTo: props.userTo,
        userFrom: localStorage.getItem('userId')
    }

    useEffect(() => {
        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response => {
            if (response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber);
            } else {
                alert('Failed to get subscriber information');
            }
        })

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if (response.data.success) {
                setSubscribed(response.data.subscribed);
            } else {
                alert('Failed to get subscribe information');
            }
        })

    }, []);

    const onSubscribe = () => {
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId')
        }

        if (Subscribed) {// 이미 구독중이라면
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('Failed to unsubscribe');
                }
            })
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('Failed to subscribe');
                }
            })
        }
    }

    return (
        <div>
            <button 
                style={{ 
                    backgroundColor: `${Subscribed ? 'gray' : 'red'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )

}

export default Subscribe;
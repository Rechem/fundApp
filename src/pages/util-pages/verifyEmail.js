import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {

    const navigate = useNavigate()

    const { token } = useParams();

    const sendVerification = async () => {
        try {
            await axios.post('/users/verifyEmail', {
                token
            })
            navigate('/connexion', {state : 'succes'})
        } catch (e) {
            navigate('/connexion', {state : 'fail'})
        }
    }

    useEffect(()=>{
        sendVerification()
    },[])

    return (
        <div>
            
        </div>
    );
};

export default VerifyEmail;
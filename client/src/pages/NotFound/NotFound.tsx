import React, { useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom';

import './NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    //COUNT 5 SECONDS AND AFTER THOSES 5 SECONDS REDIRECT TO HOME PAGE
    useEffect(() => {
        const countdownTimer = setTimeout(() => {
          if (countdown === 1) {
            navigate('/');
          } else {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }
        }, 1000);
    
        return () => clearTimeout(countdownTimer);
      }, [countdown, navigate]);

    return (
        <div className='NotFound-Container'>
            <h1>404 - Page Not Found</h1>
            <p>Redirecting to Home in {countdown} seconds...</p>
        </div>
    );
}
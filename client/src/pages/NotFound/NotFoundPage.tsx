import React, { useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    //Count 5 seconds and after thoses 5 seconds redirect to Home Page
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
        <div className='Centered-Container'>
            <h1>404 - Page Not Found</h1>
            <p>Redirecting to Home in {countdown} seconds...</p>
        </div>
    );
}
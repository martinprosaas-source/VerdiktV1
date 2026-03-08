import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/signup', { replace: true });
    }, [navigate]);

    return null;
};

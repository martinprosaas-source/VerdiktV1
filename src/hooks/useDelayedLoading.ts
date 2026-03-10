import { useState, useEffect } from 'react';

/**
 * Returns true only after `delay` ms of continuous loading.
 * Prevents flash of spinner for fast loads.
 */
export const useDelayedLoading = (loading: boolean, delay = 300): boolean => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (!loading) {
            setShowSpinner(false);
            return;
        }

        const timer = setTimeout(() => {
            if (loading) setShowSpinner(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [loading, delay]);

    return showSpinner;
};

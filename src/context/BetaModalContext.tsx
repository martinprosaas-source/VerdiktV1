import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { BetaModal } from '../components/BetaModal';

interface BetaModalContextType {
    openBetaModal: () => void;
    closeBetaModal: () => void;
    isOpen: boolean;
}

const BetaModalContext = createContext<BetaModalContextType | undefined>(undefined);

export const useBetaModal = () => {
    const context = useContext(BetaModalContext);
    if (!context) {
        throw new Error('useBetaModal must be used within a BetaModalProvider');
    }
    return context;
};

interface BetaModalProviderProps {
    children: ReactNode;
}

export const BetaModalProvider = ({ children }: BetaModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const openBetaModal = () => setIsOpen(true);
    const closeBetaModal = () => setIsOpen(false);

    return (
        <BetaModalContext.Provider value={{ openBetaModal, closeBetaModal, isOpen }}>
            {children}
            <BetaModal isOpen={isOpen} onClose={closeBetaModal} />
        </BetaModalContext.Provider>
    );
};

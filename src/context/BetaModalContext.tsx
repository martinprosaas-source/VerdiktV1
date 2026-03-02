import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { BetaModal } from '../components/BetaModal';

export type SelectedPlan = 'Pro' | 'Business' | null;

interface BetaModalContextType {
    openBetaModal: (plan?: SelectedPlan) => void;
    closeBetaModal: () => void;
    isOpen: boolean;
    selectedPlan: SelectedPlan;
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
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>(null);

    const openBetaModal = (plan?: SelectedPlan) => {
        setSelectedPlan(plan || null);
        setIsOpen(true);
    };
    const closeBetaModal = () => {
        setIsOpen(false);
        setSelectedPlan(null);
    };

    return (
        <BetaModalContext.Provider value={{ openBetaModal, closeBetaModal, isOpen, selectedPlan }}>
            {children}
            <BetaModal isOpen={isOpen} onClose={closeBetaModal} selectedPlan={selectedPlan} />
        </BetaModalContext.Provider>
    );
};

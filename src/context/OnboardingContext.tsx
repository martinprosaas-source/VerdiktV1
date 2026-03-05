import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Pole {
    id: string;
    name: string;
    description: string;
    color: string;
}

export interface OnboardingData {
    // Step 1 - Profile
    firstName: string;
    lastName: string;
    role: string;
    avatar: string | null;
    
    // Step 2 - Workspace
    teamName: string;
    teamSize: string;
    workspaceSlug: string;
    logo: string | null;
    
    // Step 3 - Poles
    poles: Pole[];
    
    // Step 4 - Invitations
    inviteEmails: string[];
    
    // Step 5 - Integrations
    connectedIntegrations: string[];
    
    // Step 6 - First Decision
    firstDecisionQuestion: string;
}

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    totalSteps: number;
    nextStep: () => void;
    prevStep: () => void;
    canGoNext: boolean;
    setCanGoNext: (can: boolean) => void;
}

const defaultData: OnboardingData = {
    firstName: '',
    lastName: '',
    role: '',
    avatar: null,
    teamName: '',
    teamSize: '',
    workspaceSlug: '',
    logo: null,
    poles: [
        {
            id: 'pole-1',
            name: 'Pôle Marketing & Communication',
            description: 'Stratégie marketing, communication, acquisition clients',
            color: '#a855f7', // purple
        },
        {
            id: 'pole-2',
            name: 'Pôle Design & Créa',
            description: 'Design produit, identité visuelle, UX/UI',
            color: '#ec4899', // pink
        },
        {
            id: 'pole-3',
            name: 'Pôle Tech & Produit',
            description: 'Développement, infrastructure, produit',
            color: '#3b82f6', // blue
        },
        {
            id: 'pole-4',
            name: 'Pôle Ops & Finance',
            description: 'Opérations, finance, RH, juridique',
            color: '#10b981', // emerald
        },
    ],
    inviteEmails: [],
    connectedIntegrations: [],
    firstDecisionQuestion: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [currentStep, setCurrentStep] = useState(1);
    const [canGoNext, setCanGoNext] = useState(false);
    const totalSteps = 6;

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            setCanGoNext(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <OnboardingContext.Provider value={{
            data,
            updateData,
            currentStep,
            setCurrentStep,
            totalSteps,
            nextStep,
            prevStep,
            canGoNext,
            setCanGoNext,
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

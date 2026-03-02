import { createContext, useContext, useState, type ReactNode } from 'react';

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
    
    // Step 3 - Invitations
    inviteEmails: string[];
    
    // Step 4 - Integrations
    connectedIntegrations: string[];
    
    // Step 5 - First Decision
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
    inviteEmails: [],
    connectedIntegrations: [],
    firstDecisionQuestion: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [currentStep, setCurrentStep] = useState(1);
    const [canGoNext, setCanGoNext] = useState(false);
    const totalSteps = 5;

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

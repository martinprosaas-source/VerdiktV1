import { Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeadlineIndicatorProps {
    deadline: Date;
    showLabel?: boolean;
    size?: 'xs' | 'sm' | 'md';
}

const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return { text: 'Terminée', urgency: 'expired' as const };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) {
        return { text: `${minutes}min`, urgency: 'critical' as const };
    } else if (hours < 6) {
        return { text: `${hours}h`, urgency: 'critical' as const };
    } else if (hours < 24) {
        return { text: `${hours}h`, urgency: 'urgent' as const };
    } else if (days < 3) {
        return { text: `${days}j`, urgency: 'warning' as const };
    } else {
        return { text: `${days}j`, urgency: 'normal' as const };
    }
};

const urgencyStyles = {
    expired: {
        bg: 'bg-zinc-500/10',
        text: 'text-zinc-600 dark:text-zinc-400',
        icon: 'text-zinc-500',
        pulse: false,
    },
    critical: {
        bg: 'bg-red-500/10',
        text: 'text-red-600 dark:text-red-400',
        icon: 'text-red-500',
        pulse: true,
    },
    urgent: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-600 dark:text-orange-400',
        icon: 'text-orange-500',
        pulse: true,
    },
    warning: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: 'text-yellow-500',
        pulse: false,
    },
    normal: {
        bg: 'bg-zinc-100 dark:bg-white/5',
        text: 'text-tertiary',
        icon: 'text-tertiary',
        pulse: false,
    },
};

const sizeStyles = {
    xs: {
        container: 'px-1.5 py-0.5 gap-1',
        text: 'text-[10px]',
        icon: 'w-3 h-3',
    },
    sm: {
        container: 'px-2 py-1 gap-1.5',
        text: 'text-xs',
        icon: 'w-3.5 h-3.5',
    },
    md: {
        container: 'px-2.5 py-1.5 gap-2',
        text: 'text-sm',
        icon: 'w-4 h-4',
    },
};

export const DeadlineIndicator = ({ 
    deadline, 
    showLabel = true,
    size = 'sm' 
}: DeadlineIndicatorProps) => {
    const { text, urgency } = getTimeRemaining(deadline);
    const style = urgencyStyles[urgency];
    const sizeStyle = sizeStyles[size];

    const Icon = urgency === 'critical' ? AlertTriangle : Clock;

    return (
        <div className={`relative inline-flex items-center rounded-full font-medium ${style.bg} ${sizeStyle.container}`}>
            {style.pulse && (
                <motion.div
                    className={`absolute inset-0 rounded-full ${style.bg}`}
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}
            <Icon className={`relative ${style.icon} ${sizeStyle.icon}`} />
            <span className={`relative ${style.text} ${sizeStyle.text}`}>
                {showLabel && urgency !== 'expired' ? 'Dans ' : ''}{text}
            </span>
        </div>
    );
};

// Compact version for cards
export const DeadlineBadge = ({ deadline }: { deadline: Date }) => {
    const { text, urgency } = getTimeRemaining(deadline);
    const style = urgencyStyles[urgency];

    if (urgency === 'normal' || urgency === 'expired') {
        return (
            <span className={`text-[10px] ${style.text}`}>
                {text}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium ${style.bg} ${style.text}`}>
            {urgency === 'critical' && <AlertTriangle className="w-2.5 h-2.5" />}
            {text}
        </span>
    );
};

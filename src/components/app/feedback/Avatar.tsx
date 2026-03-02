import { cn } from '../../../lib/utils';

interface AvatarProps {
    firstName: string;
    lastName: string;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

const colorMap: Record<string, string> = {
    emerald: 'from-emerald-400 to-emerald-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600',
    pink: 'from-pink-400 to-pink-600',
    red: 'from-red-400 to-red-600',
    yellow: 'from-yellow-400 to-yellow-600',
    cyan: 'from-cyan-400 to-cyan-600',
};

const sizeMap = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
};

export const Avatar = ({ 
    firstName, 
    lastName, 
    color = 'emerald', 
    size = 'md',
    className 
}: AvatarProps) => {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    const gradient = colorMap[color] || colorMap.emerald;

    return (
        <div 
            className={cn(
                'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-medium',
                gradient,
                sizeMap[size],
                className
            )}
        >
            {initials}
        </div>
    );
};

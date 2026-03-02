import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    linkTo?: string | null;
    className?: string;
}

const sizes = {
    sm: { icon: 'w-8 h-8', logo: 'h-9' },
    md: { icon: 'w-10 h-10', logo: 'h-11' },
    lg: { icon: 'w-12 h-12', logo: 'h-14' },
};

// Full logo (icon + "Verdikt" text as image)
export const Logo = ({ 
    size = 'md', 
    linkTo = '/',
    className = '' 
}: LogoProps) => {
    const { theme } = useTheme();
    
    const logoSrc = theme === 'dark' 
        ? '/Logo FN verdikt.png' 
        : '/logo FB verdikt.png';

    const sizeConfig = sizes[size];

    const content = (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`flex items-center ${className}`}
        >
            <img 
                src={logoSrc} 
                alt="Verdikt" 
                className={`${sizeConfig.logo} object-contain`}
            />
        </motion.div>
    );

    if (linkTo) {
        return <Link to={linkTo}>{content}</Link>;
    }

    return content;
};

// Icon-only (just the symbol)
export const LogoIcon = ({ 
    size = 'md',
    className = '' 
}: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const { theme } = useTheme();
    
    const iconSrc = theme === 'dark' 
        ? '/signifiant FN verdikt.png' 
        : '/Signifiant FB verdikt.png';

    const sizeConfig = sizes[size];

    return (
        <img 
            src={iconSrc} 
            alt="Verdikt" 
            className={`${sizeConfig.icon} object-contain ${className}`}
        />
    );
};

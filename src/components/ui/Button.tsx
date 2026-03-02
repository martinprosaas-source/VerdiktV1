
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    href?: string;
}

// Extends ButtonProps but adds motion props compatibility
type CombinedProps = ButtonProps & HTMLMotionProps<"button">;

export const Button = ({
    variant = 'primary',
    children,
    icon,
    className,
    href,
    ...props
}: CombinedProps) => {
    const baseStyles = "relative inline-flex items-center justify-center text-sm font-semibold transition-all duration-300 rounded-full group";

    const variants = {
        primary: "text-white bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_30px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5",
        secondary: "text-primary/90 bg-secondary/10 hover:bg-secondary/20 border border-border-subtle hover:border-border-hover dark:text-white/90 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-white/20 font-medium"
    };

    const content = (
        <>
            <span className="relative z-10">{children}</span>
            {icon && (
                <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                    {icon}
                </span>
            )}
        </>
    );

    const classes = cn(
        baseStyles,
        variants[variant],
        variant === 'primary' ? 'px-6 py-3.5' : 'px-6 py-3.5', // Consistent padding for now
        className
    );

    if (href) {
        return (
            <a href={href} className={classes}>
                {content}
            </a>
        );
    }

    return (
        <motion.button
            className={classes}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {content}
        </motion.button>
    );
};

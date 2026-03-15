import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Decision } from '../../../types';
import { StatusBadge, getStatusVariant, getStatusLabel } from '../feedback/Badge';
import { Progress } from '../feedback/Progress';
import { Avatar } from '../feedback/Avatar';
import { DeadlineBadge } from '../feedback/DeadlineIndicator';

interface DecisionCardProps {
    decision: Decision;
    index?: number;
}

export const DecisionCard = ({ decision, index = 0 }: DecisionCardProps) => {
    const options = decision.options || [];
    const participants = decision.participants || [];

    const totalVotes = options.reduce((acc, opt) => acc + (opt.votes || 0), 0);
    const totalParticipants = participants.length;
    const hasVoted = false;
    const isActive = decision.status === 'active';

    const deadlineDate = decision.deadline instanceof Date 
        ? decision.deadline 
        : new Date(decision.deadline);

    const isValidDeadline = deadlineDate instanceof Date && !isNaN(deadlineDate.getTime());

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ x: 4, transition: { duration: 0.15 } }}
        >
            <Link 
                to={`/app/decisions/${decision.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 px-4 lg:px-5 py-3 sm:py-3 bg-card border border-zinc-200 dark:border-white/5 rounded-lg hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:bg-card-hover transition-all group"
            >
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.06 + 0.1 }}
                        className={`w-1 h-8 sm:h-8 rounded-full flex-shrink-0 origin-center ${isActive ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-white/20'}`}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-sm font-medium text-primary truncate group-hover:text-emerald-500 transition-colors">
                                {decision.title}
                            </h3>
                            {!isActive && (
                                <StatusBadge variant={getStatusVariant(decision.status)}>
                                    {getStatusLabel(decision.status)}
                                </StatusBadge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-tertiary">
                            <span>{totalVotes}/{totalParticipants || '?'} votes</span>
                            {isActive && isValidDeadline && <DeadlineBadge deadline={deadlineDate} />}
                            {hasVoted && <span className="text-emerald-500">✓ Voté</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 lg:gap-6 pl-4 sm:pl-0">
                    <div className="w-24 sm:w-32 md:w-40 lg:w-52 xl:w-64 flex-shrink-0">
                        <Progress value={totalVotes} max={totalParticipants || 1} size="sm" />
                    </div>

                    {decision.creator && (
                        <div className="hidden lg:flex items-center gap-2 text-xs text-tertiary flex-shrink-0">
                            <Avatar 
                                firstName={decision.creator.firstName || ''}
                                lastName={decision.creator.lastName || ''}
                                color={decision.creator.avatarColor}
                                size="xs"
                            />
                            <span className="truncate max-w-[100px]">{decision.creator.firstName}</span>
                        </div>
                    )}

                    {participants.length > 0 && (
                        <div className="flex -space-x-1.5 flex-shrink-0">
                            {participants.slice(0, 3).map((user) => (
                                <Avatar 
                                    key={user.id}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    color={user.avatarColor}
                                    size="xs"
                                    className="border-2 border-card"
                                />
                            ))}
                            {participants.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-[10px] text-tertiary border-2 border-card">
                                    +{participants.length - 3}
                                </div>
                            )}
                        </div>
                    )}

                    <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
            </Link>
        </motion.div>
    );
};

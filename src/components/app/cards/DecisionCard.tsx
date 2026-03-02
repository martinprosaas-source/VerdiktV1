import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Decision } from '../../../types';
import { StatusBadge, getStatusVariant, getStatusLabel } from '../feedback/Badge';
import { Progress } from '../feedback/Progress';
import { Avatar } from '../feedback/Avatar';
import { DeadlineBadge } from '../feedback/DeadlineIndicator';
import { currentUser, poles } from '../../../data/mockData';

interface DecisionCardProps {
    decision: Decision;
}

export const DecisionCard = ({ decision }: DecisionCardProps) => {
    const totalVotes = decision.options.reduce((acc, opt) => acc + opt.votes, 0);
    const totalParticipants = decision.participants.length;
    
    const hasVoted = decision.options.some(opt => opt.voters.includes(currentUser.id));
    const isActive = decision.status === 'active';

    const pole = decision.poleId ? poles.find(p => p.id === decision.poleId) : null;

    const getPoleColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
            blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
            yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        };
        return colors[color] || colors.blue;
    };

    return (
        <Link 
            to={`/app/decisions/${decision.id}`}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 px-4 lg:px-5 py-3 sm:py-3 bg-card border border-zinc-200 dark:border-white/5 rounded-lg hover:border-zinc-300 dark:hover:border-white/10 hover:bg-card-hover transition-all group"
        >
            {/* Mobile: Top row with status + title */}
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                {/* Status indicator */}
                <div className={`w-1 h-8 sm:h-8 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-white/20'}`} />

                {/* Title & meta */}
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
                        {pole && (
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-medium ${getPoleColorClass(pole.color)}`}>
                                {pole.name.replace('Pôle ', '')}
                            </span>
                        )}
                        <span>{totalVotes}/{totalParticipants} votes</span>
                        {isActive && <DeadlineBadge deadline={decision.deadline} />}
                        {hasVoted && <span className="text-emerald-500">✓ Voté</span>}
                    </div>
                </div>
            </div>

            {/* Mobile: Bottom row with progress + avatars */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 lg:gap-6 pl-4 sm:pl-0">
                {/* Progress */}
                <div className="w-24 sm:w-32 md:w-40 lg:w-52 xl:w-64 flex-shrink-0">
                    <Progress value={totalVotes} max={totalParticipants} size="sm" />
                </div>

                {/* Creator - visible on lg+ */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-tertiary flex-shrink-0">
                    <Avatar 
                        firstName={decision.creator.firstName}
                        lastName={decision.creator.lastName}
                        color={decision.creator.avatarColor}
                        size="xs"
                    />
                    <span className="truncate max-w-[100px]">{decision.creator.firstName}</span>
                </div>

                {/* Participants avatars - show fewer on mobile */}
                <div className="flex -space-x-1.5 flex-shrink-0">
                    {decision.participants.slice(0, 3).map((user) => (
                        <Avatar 
                            key={user.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            color={user.avatarColor}
                            size="xs"
                            className="border-2 border-card"
                        />
                    ))}
                    {decision.participants.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-[10px] text-tertiary border-2 border-card">
                            +{decision.participants.length - 3}
                        </div>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
        </Link>
    );
};

import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    Clock, 
    Users, 
    Vote,
    MessageSquare,
    Award,
    Zap,
    ThumbsUp,
    Activity
} from 'lucide-react';
import { teamAnalytics, users, poles, decisions } from '../../data/mockData';
import { Avatar } from '../../components/app/feedback/Avatar';

const StatCard = ({ 
    label, 
    value, 
    subValue, 
    trend, 
    icon: Icon,
    gradient = false
}: { 
    label: string; 
    value: string | number; 
    subValue?: string; 
    trend?: { value: number; positive: boolean };
    icon: React.ElementType;
    gradient?: boolean;
}) => (
    <div className={`bg-card border border-zinc-200 dark:border-white/5 rounded-xl px-5 py-5 transition-all hover:scale-[1.02] hover:shadow-lg ${
        gradient ? 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/20' : ''
    }`}>
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-xs text-tertiary font-medium uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-primary mt-2">{value}</p>
                {subValue && (
                    <p className="text-xs text-tertiary mt-1">{subValue}</p>
                )}
                {trend && (
                    <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{trend.positive ? '+' : ''}{trend.value}% vs mois dernier</span>
                    </div>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gradient ? 'bg-white/50 dark:bg-white/10' : 'bg-emerald-500/10'
            }`}>
                <Icon className={`w-6 h-6 ${gradient ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'}`} />
            </div>
        </div>
    </div>
);

// Simple bar chart component
const BarChart = ({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const labelHeight = 20;
    
    return (
        <div className="h-full flex flex-col" style={{ minHeight: height }}>
            {/* Chart area */}
            <div className="flex-1 flex items-end justify-between gap-2 pb-0">
                {data.map((item, index) => {
                    const barHeightPercent = (item.value / maxValue) * 100;
                    return (
                        <div 
                            key={index} 
                            className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg relative group cursor-pointer transition-all hover:from-emerald-400 hover:to-emerald-300 hover:scale-105"
                            style={{ height: `${barHeightPercent}%`, minHeight: 12 }}
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-card border border-zinc-200 dark:border-white/10 rounded-lg text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                                {item.value} décisions
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Labels */}
            <div className="flex justify-between gap-2 pt-3 flex-shrink-0" style={{ height: labelHeight }}>
                {data.map((item, index) => (
                    <span key={index} className="flex-1 text-center text-xs font-medium text-tertiary">{item.label}</span>
                ))}
            </div>
        </div>
    );
};

// Donut chart component for decision status
const DonutChart = ({ completed, active, total }: { completed: number; active: number; total: number }) => {
    const completedPercent = (completed / total) * 100;
    const activePercent = (active / total) * 100;
    const circumference = 2 * Math.PI * 45;
    const completedStroke = (completedPercent / 100) * circumference;
    const activeStroke = (activePercent / 100) * circumference;
    
    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-zinc-100 dark:text-white/5"
                />
                {/* Completed arc */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${completedStroke} ${circumference}`}
                    className="text-emerald-500 transition-all duration-1000"
                    strokeLinecap="round"
                />
                {/* Active arc */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${activeStroke} ${circumference}`}
                    strokeDashoffset={-completedStroke}
                    className="text-blue-500 transition-all duration-1000"
                    strokeLinecap="round"
                />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-primary">{total}</p>
                <p className="text-xs text-tertiary mt-1">Décisions</p>
            </div>
        </div>
    );
};

// Progress bar for participation
const ParticipationBar = ({ value, max, color = 'emerald' }: { value: number; max: number; color?: string }) => {
    const percentage = Math.round((value / max) * 100);
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        pink: 'bg-pink-500',
    };
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${colorClasses[color] || colorClasses.emerald} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs font-medium text-tertiary w-10 text-right">{percentage}%</span>
        </div>
    );
};

// Leaderboard component
const LeaderboardCard = ({ 
    rank, 
    user, 
    score, 
    metric,
    color 
}: { 
    rank: number; 
    user: { firstName: string; lastName: string; avatarColor?: string }; 
    score: number;
    metric: string;
    color: string;
}) => {
    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-all">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-tertiary flex-shrink-0">
                {getMedalEmoji(rank) || rank}
            </div>
            <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                color={user.avatarColor}
                size="sm"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                    {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-tertiary">{metric}</p>
            </div>
            <div className="text-right">
                <p className={`text-lg font-bold ${color}`}>{score}</p>
            </div>
        </div>
    );
};

export const Analytics = () => {
    const trendDecisions = teamAnalytics.decisionsLastMonth > 0
        ? Math.round(((teamAnalytics.decisionsThisMonth - teamAnalytics.decisionsLastMonth) / teamAnalytics.decisionsLastMonth) * 100)
        : 0;

    // Find max values for normalization
    const maxVotes = Math.max(...teamAnalytics.participationByMember.map(m => m.votesCount));

    // Calculate pole statistics
    const poleStats = poles.map(pole => {
        const poleMembers = users.filter(u => u.poleId === pole.id);
        const poleDecisions = decisions.filter(d => d.poleId === pole.id);
        const totalVotes = poleMembers.reduce((sum, member) => {
            const stats = teamAnalytics.participationByMember.find(p => p.userId === member.id);
            return sum + (stats?.votesCount || 0);
        }, 0);
        
        return {
            pole,
            memberCount: poleMembers.length,
            decisionCount: poleDecisions.length,
            totalVotes,
            avgVotesPerMember: poleMembers.length > 0 ? Math.round(totalVotes / poleMembers.length) : 0,
        };
    }).sort((a, b) => b.totalVotes - a.totalVotes);

    const totalArguments = teamAnalytics.participationByMember.reduce((sum, m) => sum + m.argumentsCount, 0);
    const avgArgumentsPerDecision = Math.round((totalArguments / teamAnalytics.totalDecisions) * 10) / 10;

    // Top performers
    const topVoters = [...teamAnalytics.participationByMember]
        .sort((a, b) => b.votesCount - a.votesCount)
        .slice(0, 5);
    
    const topContributors = [...teamAnalytics.participationByMember]
        .sort((a, b) => b.argumentsCount - a.argumentsCount)
        .slice(0, 5);
    
    const topCreators = [...teamAnalytics.participationByMember]
        .sort((a, b) => b.decisionsCreated - a.decisionsCreated)
        .slice(0, 5);

    const getPoleColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'bg-purple-500',
            pink: 'bg-pink-500',
            blue: 'bg-blue-500',
            emerald: 'bg-emerald-500',
            orange: 'bg-orange-500',
            cyan: 'bg-cyan-500',
            yellow: 'bg-yellow-500',
            red: 'bg-red-500',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-primary">Analytics</h1>
                <p className="text-sm text-tertiary mt-1">Vue d'ensemble de l'activité et performance de l'équipe</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Décisions totales"
                    value={teamAnalytics.totalDecisions}
                    subValue={`${teamAnalytics.completedDecisions} terminées`}
                    icon={Vote}
                    gradient={true}
                />
                <StatCard
                    label="Ce mois"
                    value={teamAnalytics.decisionsThisMonth}
                    trend={{ 
                        value: Math.abs(trendDecisions), 
                        positive: trendDecisions >= 0 
                    }}
                    icon={BarChart3}
                />
                <StatCard
                    label="Participation"
                    value={`${teamAnalytics.averageParticipationRate}%`}
                    subValue="taux moyen"
                    icon={Users}
                />
                <StatCard
                    label="Vitesse"
                    value={`${teamAnalytics.averageTimeToDecision}h`}
                    subValue="temps moyen"
                    icon={Clock}
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Decisions by Month - Enhanced */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-primary">Décisions par mois</h2>
                            <p className="text-xs text-tertiary mt-0.5">Évolution sur 5 mois</p>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 rounded-lg">
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                +{trendDecisions >= 0 ? trendDecisions : 0}%
                            </span>
                        </div>
                    </div>
                    <div className="min-h-[220px] mb-6">
                        <BarChart 
                            data={teamAnalytics.decisionsByMonth.map(d => ({ label: d.month, value: d.count }))}
                            height={220}
                        />
                    </div>
                    {/* Additional Stats under chart */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-white/5">
                        <div className="text-center p-3 bg-emerald-500/5 rounded-lg">
                            <p className="text-xl font-bold text-emerald-500">
                                {Math.max(...teamAnalytics.decisionsByMonth.map(d => d.count))}
                            </p>
                            <p className="text-[10px] text-tertiary mt-1 uppercase tracking-wide">Pic mensuel</p>
                        </div>
                        <div className="text-center p-3 bg-blue-500/5 rounded-lg">
                            <p className="text-xl font-bold text-blue-500">
                                {Math.round(teamAnalytics.decisionsByMonth.reduce((sum, d) => sum + d.count, 0) / teamAnalytics.decisionsByMonth.length)}
                            </p>
                            <p className="text-[10px] text-tertiary mt-1 uppercase tracking-wide">Moyenne</p>
                        </div>
                        <div className="text-center p-3 bg-purple-500/5 rounded-lg">
                            <p className="text-xl font-bold text-purple-500">
                                {teamAnalytics.decisionsByMonth.reduce((sum, d) => sum + d.count, 0)}
                            </p>
                            <p className="text-[10px] text-tertiary mt-1 uppercase tracking-wide">Total 5 mois</p>
                        </div>
                    </div>
                </div>

                {/* Decision Status Distribution */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-base font-semibold text-primary">Répartition des décisions</h2>
                        <p className="text-xs text-tertiary mt-0.5">Status et progression</p>
                    </div>
                    <div className="flex items-center justify-center mb-6">
                        <DonutChart 
                            completed={teamAnalytics.completedDecisions}
                            active={teamAnalytics.totalDecisions - teamAnalytics.completedDecisions}
                            total={teamAnalytics.totalDecisions}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {teamAnalytics.completedDecisions}
                            </p>
                            <p className="text-xs text-tertiary mt-2 font-medium">Terminées</p>
                            <div className="mt-3 pt-3 border-t border-emerald-500/20">
                                <p className="text-lg font-bold text-emerald-500">
                                    {Math.round((teamAnalytics.completedDecisions / teamAnalytics.totalDecisions) * 100)}%
                                </p>
                                <p className="text-[10px] text-tertiary mt-0.5">Taux de complétion</p>
                            </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {teamAnalytics.totalDecisions - teamAnalytics.completedDecisions}
                            </p>
                            <p className="text-xs text-tertiary mt-2 font-medium">En cours</p>
                            <div className="mt-3 pt-3 border-t border-blue-500/20">
                                <p className="text-lg font-bold text-blue-500">
                                    {Math.round(((teamAnalytics.totalDecisions - teamAnalytics.completedDecisions) / teamAnalytics.totalDecisions) * 100)}%
                                </p>
                                <p className="text-[10px] text-tertiary mt-0.5">En progression</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pole Statistics */}
            <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm mb-6">
                <div className="mb-6">
                    <h2 className="text-base font-semibold text-primary">Performance par pôle</h2>
                    <p className="text-xs text-tertiary mt-0.5">Activité et engagement par département</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {poleStats.map((stat) => (
                        <div 
                            key={stat.pole.id}
                            className="p-4 rounded-xl bg-gradient-to-br from-zinc-50 to-white dark:from-white/[0.02] dark:to-white/[0.05] border border-zinc-200 dark:border-white/5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getPoleColorClass(stat.pole.color)}`}></div>
                                    <h3 className="text-sm font-semibold text-primary">
                                        {stat.pole.name.replace('Pôle ', '')}
                                    </h3>
                                </div>
                                <span className="text-xs text-tertiary">{stat.memberCount} membres</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-primary">{stat.decisionCount}</p>
                                    <p className="text-[10px] text-tertiary mt-1">Décisions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-primary">{stat.totalVotes}</p>
                                    <p className="text-[10px] text-tertiary mt-1">Votes</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-primary">{stat.avgVotesPerMember}</p>
                                    <p className="text-[10px] text-tertiary mt-1">Moy/membre</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Top Voters */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <ThumbsUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-primary">Top Votants</h2>
                            <p className="text-xs text-tertiary">Plus actifs</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {topVoters.map((member, index) => (
                            <LeaderboardCard
                                key={member.userId}
                                rank={index + 1}
                                user={member.user}
                                score={member.votesCount}
                                metric="votes"
                                color="text-emerald-500"
                            />
                        ))}
                    </div>
                </div>

                {/* Top Contributors */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-primary">Top Contributeurs</h2>
                            <p className="text-xs text-tertiary">Plus d'arguments</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {topContributors.map((member, index) => (
                            <LeaderboardCard
                                key={member.userId}
                                rank={index + 1}
                                user={member.user}
                                score={member.argumentsCount}
                                metric="arguments"
                                color="text-purple-500"
                            />
                        ))}
                    </div>
                </div>

                {/* Top Creators */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-primary">Top Créateurs</h2>
                            <p className="text-xs text-tertiary">Plus de décisions</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {topCreators.map((member, index) => (
                            <LeaderboardCard
                                key={member.userId}
                                rank={index + 1}
                                user={member.user}
                                score={member.decisionsCreated}
                                metric="décisions créées"
                                color="text-blue-500"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Team Participation */}
            <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-base font-semibold text-primary">Participation de l'équipe</h2>
                        <p className="text-xs text-tertiary mt-0.5">Vue détaillée par membre</p>
                    </div>
                    <span className="text-xs text-tertiary">{users.length} membres</span>
                </div>
                <div className="space-y-5">
                    {teamAnalytics.participationByMember
                        .sort((a, b) => b.votesCount - a.votesCount)
                        .map((member) => (
                            <div key={member.userId} className="group">
                                <div className="flex items-center gap-3 mb-2">
                                    <Avatar
                                        firstName={member.user.firstName}
                                        lastName={member.user.lastName}
                                        color={member.user.avatarColor}
                                        size="sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-primary">
                                                {member.user.firstName} {member.user.lastName}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-tertiary">
                                                    <span className="font-semibold text-emerald-500">{member.votesCount}</span> votes
                                                </span>
                                                <span className="text-xs text-tertiary">
                                                    <span className="font-semibold text-purple-500">{member.argumentsCount}</span> arguments
                                                </span>
                                                <span className="text-xs text-tertiary">
                                                    <span className="font-semibold text-blue-500">{member.decisionsCreated}</span> créées
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <ParticipationBar value={member.votesCount} max={maxVotes} color="emerald" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Insights */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-base font-semibold text-primary">Insights clés</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary">Participation excellente</p>
                                <p className="text-xs text-secondary mt-1 leading-relaxed">
                                    {teamAnalytics.averageParticipationRate}% des membres votent sur chaque décision. C'est 2x supérieur à la moyenne du marché.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary">Décisions ultra-rapides</p>
                                <p className="text-xs text-secondary mt-1 leading-relaxed">
                                    Moyenne de {teamAnalytics.averageTimeToDecision}h pour conclure une décision. Votre équipe est {Math.round(48 / teamAnalytics.averageTimeToDecision)}x plus rapide que la moyenne.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary">Débats riches</p>
                                <p className="text-xs text-secondary mt-1 leading-relaxed">
                                    {avgArgumentsPerDecision} arguments en moyenne par décision. Les décisions sont bien documentées et débattues.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Award className="w-5 h-5 text-amber-500" />
                        <h2 className="text-base font-semibold text-primary">Métriques d'engagement</h2>
                    </div>
                    <div className="space-y-5">
                        {/* Total Votes */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-tertiary uppercase tracking-wide">Votes totaux</span>
                                <span className="text-lg font-bold text-primary">
                                    {teamAnalytics.participationByMember.reduce((sum, m) => sum + m.votesCount, 0)}
                                </span>
                            </div>
                            <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-full"></div>
                            </div>
                        </div>

                        {/* Total Arguments */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-tertiary uppercase tracking-wide">Arguments totaux</span>
                                <span className="text-lg font-bold text-primary">{totalArguments}</span>
                            </div>
                            <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full w-full"></div>
                            </div>
                        </div>

                        {/* Decisions Created */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-tertiary uppercase tracking-wide">Décisions créées</span>
                                <span className="text-lg font-bold text-primary">
                                    {teamAnalytics.participationByMember.reduce((sum, m) => sum + m.decisionsCreated, 0)}
                                </span>
                            </div>
                            <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-full"></div>
                            </div>
                        </div>

                        {/* Active Members */}
                        <div className="pt-3 border-t border-zinc-200 dark:border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-tertiary uppercase tracking-wide">Membres actifs</p>
                                    <p className="text-xs text-tertiary mt-0.5">7 derniers jours</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-emerald-500">{users.length}</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">100%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

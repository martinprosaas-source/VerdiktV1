interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
    <div className={`animate-pulse bg-zinc-200 dark:bg-white/[0.06] rounded ${className}`} />
);

export const DashboardSkeleton = () => (
    <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-36 rounded-lg" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[0, 1, 2].map(i => (
                <div key={i} className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4">
                    <Skeleton className="h-4 w-4 mb-3 rounded-full" />
                    <Skeleton className="h-7 w-12 mb-1" />
                    <Skeleton className="h-3 w-28" />
                </div>
            ))}
        </div>

        {/* Decisions list */}
        <div>
            <Skeleton className="h-3 w-28 mb-3" />
            <div className="space-y-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const DecisionsListSkeleton = () => (
    <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-36 rounded-lg" />
        </div>

        {/* Filters bar */}
        <div className="flex gap-2 mb-4">
            {[0, 1, 2].map(i => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
        </div>

        {/* Cards */}
        <div className="space-y-2">
            {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const DecisionDetailSkeleton = () => (
    <div>
        {/* Back button */}
        <Skeleton className="h-4 w-20 mb-6" />

        {/* Header */}
        <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Main column */}
            <div className="xl:col-span-3 space-y-4">
                {/* Context */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                    <Skeleton className="h-3 w-16 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Voting */}
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                    <Skeleton className="h-3 w-16 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {[0, 1, 2].map(i => (
                            <Skeleton key={i} className="h-20 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Side column */}
            <div className="space-y-4">
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                    <div className="space-y-4">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                                <div className="flex-1">
                                    <Skeleton className="h-3 w-16 mb-1" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                    <Skeleton className="h-3 w-24 mb-3" />
                    <div className="space-y-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="w-6 h-6 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

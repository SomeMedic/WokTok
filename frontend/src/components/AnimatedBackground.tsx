export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-900/90 dark:to-gray-800/90">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-white/20 dark:to-black/20" />
                <div className="absolute inset-0">
                    <div className="h-full w-full bg-gradient-to-br from-transparent via-blue-100/5 to-transparent dark:via-blue-900/5 animate-gradient-slow" />
                </div>
            </div>
        </div>
    );
} 
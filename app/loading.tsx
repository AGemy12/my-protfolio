export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg">
      <div className="relative">
        {/* Animated gradient circle */}
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

        {/* Pulse effect */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-primary/10 animate-ping" />

        {/* Shimmer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}

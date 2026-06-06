import { LuRefreshCcw, LuWifiOff } from "react-icons/lu";

export default function PageError({
  title = "Something went wrong",
  message = "We couldn't load this page. Check your connection and try again.",
  onRetry,
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-base-300/30">
      <section className="max-w-md w-full text-center rounded-box bg-primary/15 border border-white/10 p-6">
        <div className="w-14 h-14 rounded-full bg-error/20 text-error flex items-center justify-center mx-auto mb-4">
          <LuWifiOff size={26} />
        </div>

        <h1 className="text-2xl font-bold">{title}</h1>

        <p className="text-base-content/60 mt-2">{message}</p>

        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary rounded-full mt-5">
            <LuRefreshCcw />
            Try again
          </button>
        )}
      </section>
    </main>
  );
}
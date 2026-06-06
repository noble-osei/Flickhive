import { LuPlay } from "react-icons/lu";

export default function IframePlaceholder({
  title = "Loading video",
  message = "Preparing video player...",
}) {
  return (
    <div className="w-full h-full bg-base-200 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
          <LuPlay size={30} fill="currentColor" />
        </div>

        <p className="font-semibold">{title}</p>
        <p className="text-sm text-base-content/50 mt-1">{message}</p>
      </div>
    </div>
  );
}
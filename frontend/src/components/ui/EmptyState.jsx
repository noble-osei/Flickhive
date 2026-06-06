export default function EmptyState({
  title = "Nothing found",
  message = "There's nothing to show here yet.",
}) {
  return (
    <div className="rounded-box border border-white/10 bg-primary/10 p-6 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-base-content/60 mt-1">{message}</p>
    </div>
  );
}

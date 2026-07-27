import PageError from "../components/ui/PageError.jsx";

export default function useFetchGuard({
  loading,
  error,
  refetch,
  isEmpty,
  skeleton,
  errorTitle,
  errorMessage,
  emptyTitle = "No data found",
  emptyMessage,
}) {
  if (loading) return skeleton;

  if (error) {
    return (
      <PageError title={errorTitle} message={errorMessage} onRetry={refetch} />
    );
  }

  if (isEmpty) return <PageError title={emptyTitle} message={emptyMessage} />;

  return null;
}

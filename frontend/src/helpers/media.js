export const formatDate = (dataStr) => {
  const dateObj = new Date(dataStr);

  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

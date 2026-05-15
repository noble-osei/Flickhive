export const displayTitle = (itemObj) => {
  if (itemObj.media_type === "movie") {
    return itemObj.title;
  } else {
    return itemObj.name;
  }
};

export const formatDate = (dataStr) => {
  const dateObj = new Date(dataStr);

  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

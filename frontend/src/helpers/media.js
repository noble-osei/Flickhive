export const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  return formattedDate === "Invalid Date" ? dateStr : formattedDate;
};

export const formatProfession = (dept) => {
  const professionMap = {
    Acting: "Actor",
    Directing: "Director",
    Writing: "Writer",
    Production: "Producer",
    Editing: "Editor",
    Camera: "Cinematographer",
    Sound: "Sound",
    Art: "Art Director",
    Crew: "Crew",
  };

  return professionMap[dept] ?? dept;
};

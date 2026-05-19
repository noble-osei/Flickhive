export const formatDate = (dataStr) => {
  const dateObj = new Date(dataStr);

  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
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

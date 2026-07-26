export const IMG = import.meta.env.VITE_IMG;

export const POSTER_WIDTHS = [154, 185, 342, 500, 780];
export const BACKDROP_WIDTHS = [300, 780, 1280];
export const AVATAR_WIDTHS = [92, 154, 185, 342];

export const buildImageProps = (path, { widths, srcWidth, fallback }) => {
  const hasImage = !!path;

  return {
    src: hasImage ? `${IMG}/w${srcWidth}${path}` : fallback,
    srcSet: hasImage
      ? widths.map((width) => `${IMG}/w${width}${path} ${width}w`).join(", ")
      : undefined,
    onError: (e) => {
      e.target.src = fallback;
    },
  };
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "—"

  const dateObj = new Date(dateStr);
  if (Number.isNaN(dateObj.getTime())) return dateStr;

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

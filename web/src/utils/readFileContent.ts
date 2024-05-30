// file: web/src/utils/readFileContent.ts

export const readFileContent = (
  file: File,
  setFileContent: (content: string | null) => void
) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      setFileContent(reader.result);
    }
  };
  if (file.type.startsWith("image/")) {
    reader.readAsDataURL(file);
  } else if (
    file.type.startsWith("text/") ||
    file.type === "application/json"
  ) {
    reader.readAsText(file);
  }
};

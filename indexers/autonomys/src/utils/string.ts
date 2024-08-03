export const hexToString = (hex: string): string => {
  return Array.from({ length: hex.length / 2 }, (_, i) =>
    String.fromCharCode(parseInt(hex.substr(i * 2, 2), 16))
  ).join("");
};

export const sanitizeString = (str: string): string => {
  str = str.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  return str
    .replace(/\\\"/g, '"')
    .replace(/\"\{/g, "{")
    .replace(/\}\"/g, "}")
    .replace(/\"\[/g, "[")
    .replace(/\]\"/g, "]")
    .replace(/\\"/g, '"');
};

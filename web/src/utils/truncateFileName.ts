// file: web/src/utils/truncateFileName.ts

export const truncateFileName = (name: string, maxLength: number) => {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  const ext = extIndex !== -1 ? name.slice(extIndex) : "";
  const truncatedName = name.slice(0, maxLength - ext.length - 3) + "..." + ext;
  return truncatedName;
};

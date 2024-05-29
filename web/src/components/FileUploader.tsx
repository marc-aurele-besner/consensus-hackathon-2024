// file: web/src/components/FileUploader.tsx

"use client";
import Image from "next/image";
import { ChangeEvent, DragEvent, useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      readFileContent(selectedFile);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      readFileContent(selectedFile);
    }
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFileContent(reader.result);
      }
    };
    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("text/")) {
      reader.readAsText(file);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file);
      // Implement actual file upload logic here
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 border-2 border-dashed p-6 rounded-md ${
        dragActive ? "border-blue-500" : "border-gray-600"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <span className="text-gray-400 bg-gray-700 border border-gray-600 rounded p-2">
          Choose File
        </span>
        <p className="text-gray-500">or drag and drop here</p>
      </label>
      {file && (
        <div className="text-center mt-4">
          <p className="mb-2">Selected file: {file.name}</p>
          {file.type.startsWith("image/") && fileContent && (
            <div className="flex justify-center items-center">
              <Image
                src={fileContent}
                alt="Preview"
                width={300} // Set appropriate width
                height={300} // Set appropriate height
                className="mb-4"
              />
            </div>
          )}
          {file.type.startsWith("text/") && fileContent && (
            <pre className="bg-gray-700 text-white p-4 rounded mb-4">
              {fileContent}
            </pre>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

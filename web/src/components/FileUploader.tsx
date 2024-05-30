// file: web/src/components/FileUploader.tsx

"use client";
import { base32 } from "multiformats/bases/base32";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import Image from "next/image";
import { ChangeEvent, DragEvent, useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [cids, setCids] = useState<CID[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      readFileContent(selectedFile);
      generateCIDs(selectedFile);
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
      generateCIDs(selectedFile);
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
    } else if (
      file.type.startsWith("text/") ||
      file.type === "application/json"
    ) {
      reader.readAsText(file);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file);
      // Implement actual file upload logic here
    }
  };

  const generateCIDs = async (file: File) => {
    const chunkSize = 256 * 1024; // 256 KB
    const chunks = [];
    const buffer = await file.arrayBuffer();

    for (let i = 0; i < buffer.byteLength; i += chunkSize) {
      chunks.push(buffer.slice(i, i + chunkSize));
    }

    const cids = await Promise.all(
      chunks.map(async (chunk) => {
        const hash = await sha256.digest(new Uint8Array(chunk));
        return CID.create(1, 0x12, hash);
      })
    );

    setCids(cids);
  };

  const renderFileSnippet = () => {
    if (fileContent) {
      if (file?.type === "application/json") {
        try {
          const jsonSnippet = JSON.stringify(
            JSON.parse(fileContent),
            null,
            2
          ).substring(0, 500);
          return (
            <pre className="bg-gray-700 text-white p-4 rounded mb-4">
              {jsonSnippet}...
            </pre>
          );
        } catch (error) {
          return (
            <p className="bg-red-500 text-white p-4 rounded mb-4">
              Invalid JSON file
            </p>
          );
        }
      } else if (file?.type.startsWith("text/")) {
        return (
          <pre className="bg-gray-700 text-white p-4 rounded mb-4">
            {fileContent.substring(0, 500)}...
          </pre>
        );
      } else if (file?.type.startsWith("image/")) {
        return (
          <div className="flex justify-center items-center">
            <Image
              src={fileContent}
              alt="Preview"
              width={300}
              height={300}
              className="mb-4"
            />
          </div>
        );
      }
    }
    return null;
  };

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    const ext = extIndex !== -1 ? name.slice(extIndex) : "";
    const truncatedName =
      name.slice(0, maxLength - ext.length - 3) + "..." + ext;
    return truncatedName;
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
          <p className="mb-2">
            Selected file: {truncateFileName(file.name, 40)}
          </p>
          {renderFileSnippet()}
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
          >
            Upload
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800 mb-4"
          >
            {isOpen ? "Hide" : "Show"} Multi-DAG Structure
          </button>
          {isOpen && (
            <div className="mt-4 w-full max-w-md bg-gray-800 text-white p-4 rounded mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Multi-DAG Structure
              </h3>
              <ul className="list-disc list-inside">
                {cids.map((cid, index) => (
                  <li key={index} className="break-words">
                    Chunk {index + 1}: {cid.toString(base32)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;

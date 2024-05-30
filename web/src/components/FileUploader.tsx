// file: web/src/components/FileUploader.tsx

"use client";
import Image from "next/image";
import { useFileUploader } from "../hooks/useFileUploader";
import { truncateFileName } from "../utils/truncateFileName";
import ConnectWalletModal from "./ConnectWalletModal";

const FileUploader = () => {
  const {
    file,
    dragActive,
    fileContent,
    cids,
    chunkSize,
    isOpen,
    selectedCidData,
    isWalletModalOpen,
    error,
    handleFileChange,
    handleDrag,
    handleDrop,
    handleUpload,
    handleConnect,
    handleCidClick,
    setIsOpen,
    setIsWalletModalOpen,
  } = useFileUploader();

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
          <p className="mb-2">Chunk size: {chunkSize / 1024} KB</p>
          {renderFileSnippet()}
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
          >
            Connect Wallet
          </button>
          <br />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
          >
            Upload to Blockchain
          </button>
          <br />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800 mb-4"
          >
            {isOpen ? "Hide" : "Show"} Multi-DAG Structure
          </button>
          {isOpen && (
            <div className="mt-4 w-full max-w-2xl bg-gray-800 text-white p-4 rounded mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Multi-DAG Structure
              </h3>
              <ul className="list-disc list-inside">
                {cids.map((item, index) => (
                  <li
                    key={index}
                    className="break-words cursor-pointer hover:underline"
                    onClick={() =>
                      handleCidClick(item.cid, item.data, item.nextCid)
                    }
                  >
                    Chunk {index + 1}: {item.cid.toString()}
                  </li>
                ))}
              </ul>
              {selectedCidData && (
                <div className="mt-4 bg-gray-700 text-white p-4 rounded break-words">
                  <h4 className="text-md font-semibold mb-2">CID Data</h4>
                  <pre
                    style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  >
                    {JSON.stringify(selectedCidData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default FileUploader;

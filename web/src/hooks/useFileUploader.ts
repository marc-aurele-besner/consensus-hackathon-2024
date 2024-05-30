// file: web/src/hooks/useFileUploader.ts

import { CID } from "multiformats/cid";
import { ChangeEvent, DragEvent, useState } from "react";
import { ChunkData, generateCIDs } from "../utils/generateCIDs";
import { readFileContent } from "../utils/readFileContent";
import { uploadChunks } from "../utils/uploadChunks";

export const useFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [cids, setCids] = useState<ChunkData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCidData, setSelectedCidData] = useState<any | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [api, setApi] = useState<any | null>(null);
  const [account, setAccount] = useState<any | null>(null);
  const [network, setNetwork] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      readFileContent(selectedFile, setFileContent);
      if (network) {
        generateCIDs(selectedFile, network.chunkSize).then(setCids);
      }
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
      readFileContent(selectedFile, setFileContent);
      if (network) {
        generateCIDs(selectedFile, network.chunkSize).then(setCids);
      }
    }
  };

  const handleUpload = () => {
    setIsWalletModalOpen(true);
  };

  const handleConnect = async (api: any, account: any, network: any) => {
    setApi(api);
    setAccount(account);
    setNetwork(network);
    await uploadChunks(api, account, cids, setError);
  };

  const handleCidClick = (
    cid: CID,
    data: Uint8Array,
    nextCid: CID | undefined
  ) => {
    setSelectedCidData({
      cid: cid.toString(),
      data: JSON.stringify(new TextDecoder().decode(data)),
      nextCid: nextCid ? nextCid.toString() : undefined,
    });
  };

  return {
    file,
    dragActive,
    fileContent,
    cids,
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
  };
};

// file: web/src/hooks/useFileUploader.ts

"use client";
import { CID } from "multiformats/cid";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { networks } from "../constants/networks";
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
  const [chunkSize, setChunkSize] = useState<number>(256 * 1024); // Default to 256 KB
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorer, setExplorer] = useState<string | null>(null);
  const [fileFound, setFileFound] = useState(false);

  useEffect(() => {
    if (network) {
      setChunkSize(network.chunkSize);
      setExplorer(network.explorer);
      if (file) generateCIDs(file, network.chunkSize).then(setCids);
    }
  }, [network, file]);

  const handleSearch = useCallback(async (cids: ChunkData[]) => {
    if (cids.length > 0) {
      const search = await fetch(`/api/search-file/${cids[0].cid.toString()}`);
      const { found } = await search.json();
      setFileFound(found);
    }
  }, []);

  useEffect(() => {
    handleSearch(cids);
  }, [cids, handleSearch]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        readFileContent(selectedFile, setFileContent);
        if (network) {
          generateCIDs(selectedFile, network.chunkSize).then(setCids);
        } else {
          generateCIDs(selectedFile, chunkSize).then(setCids);
        }
      }
    },
    [network, chunkSize]
  );

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        readFileContent(selectedFile, setFileContent);
        if (network) {
          generateCIDs(selectedFile, network.chunkSize).then(setCids);
        } else {
          generateCIDs(selectedFile, chunkSize).then(setCids);
        }
      }
    },
    [network, chunkSize]
  );

  const handleUpload = useCallback(async () => {
    if (api && account) {
      await uploadChunks(
        api,
        account,
        cids,
        setError,
        setIsUploading,
        setTxHash
      );
    } else {
      setIsWalletModalOpen(true);
    }
  }, [api, account, cids]);

  const handleConnect = useCallback(
    async (api: any, account: any, network: any) => {
      setApi(api);
      setAccount(account);
      setNetwork(network);
    },
    []
  );

  const handleCidClick = useCallback(
    (cid: CID, data: Uint8Array, nextCid: CID | undefined) => {
      setSelectedCidData({
        cid: cid.toString(),
        data: JSON.stringify(new TextDecoder().decode(data)),
        nextCid: nextCid ? nextCid.toString() : undefined,
      });
    },
    []
  );

  return {
    file,
    dragActive,
    fileContent,
    cids,
    chunkSize,
    isOpen,
    selectedCidData,
    isWalletModalOpen,
    isUploading,
    txHash,
    explorer,
    error,
    fileFound,
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

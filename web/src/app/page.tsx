// file: web/src/app/page.tsx

import Image from "next/image";
import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <h1 className="text-4xl mt-4">Upload File to Polkadot</h1>
      </div>
      <FileUploader />
    </main>
  );
}

// file: web/src/app/page.tsx

import Image from "next/image";
import FileUploader from "../components/FileUploader";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-black text-white">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <h1 className="text-4xl mt-4">Upload File onchain</h1>
        <h3 className="text-lg mt-2">
          Currently supporting Autonomys, Kusama, Paseo and Polkadot networks
        </h3>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <FileUploader />
      </div>
      <Footer />
    </main>
  );
}

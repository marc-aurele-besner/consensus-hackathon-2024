// file: web/src/app/page.tsx

import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="text-4xl mb-8">File Upload App</h1>
      <FileUploader />
    </main>
  );
}

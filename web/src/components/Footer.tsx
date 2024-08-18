// file: web/src/components/Footer.tsx

import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex justify-center items-center bg-gray-900 text-white py-4 w-full fixed bottom-0">
      <a
        href="https://github.com/FileOnchain/fileonchain-web"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mr-8"
      >
        <FaGithub size={24} />
        <span>GitHub Repo</span>
      </a>
      <p className="flex items-center gap-2">
        Made with <FaHeart className="text-red-500" /> by Marc-Aurèle
      </p>
      <a
        href="https://github.com/marc-aurele-besner"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-8"
      >
        <FaGithub className="text-white hover:text-gray-400" size={24} />
      </a>
      <a
        href="https://www.linkedin.com/in/marc-aurele-besner/"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4"
      >
        <FaLinkedin className="text-white hover:text-gray-400" size={24} />
      </a>
      <a
        href="https://x.com/marcaureleb"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4"
      >
        <FaTwitter className="text-white hover:text-gray-400" size={24} />
      </a>
    </footer>
  );
};

export default Footer;

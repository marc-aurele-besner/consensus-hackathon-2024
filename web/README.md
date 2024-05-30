# File On-chain

This project consists of two main components:

1. A Next.js web application located in the `web` directory.
2. A SubSquid indexer located in the `indexer` directory.

## Table of Contents

- [File On-chain](#file-on-chain)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [Web Application](#web-application)
    - [SubSquid Indexer](#subsquid-indexer)
  - [Usage](#usage)
    - [Web Application](#web-application-1)
    - [SubSquid Indexer](#subsquid-indexer-1)
  - [Project Structure](#project-structure)
  - [License](#license)

## Prerequisites

- Node.js (>= 14.x)
- Yarn or npm
- Docker (for the SubSquid indexer)

## Setup Instructions

### Web Application

1. Navigate to the `web` directory:
   `cd web`

2. Install dependencies:
   `yarn install`

3. Create a `.env` file in the `web` directory and add the required environment variables. Use the provided `.env.sample` as a reference.

4. Start the development server:
   `yarn dev`

   The web application should now be running at [http://localhost:3000](http://localhost:3000).

### SubSquid Indexer

1. Navigate to the `indexer` directory:
   `cd indexer`

2. Copy the example environment file and modify it as needed:
   `cp .env.sample .env`

3. Start the SubSquid indexer using Docker:
   `docker-compose up -d`

   The indexer should now be running.

## Usage

### Web Application

- Visit [http://localhost:3000](http://localhost:3000) to access the file upload interface.
- Follow the on-screen instructions to upload a file to the Polkadot network.
- You can choose different networks (Polkadot, Kusama, Autonomys Testnet, Polkadot Testnet) and the file will be chunked and uploaded accordingly.

### SubSquid Indexer

- The SubSquid indexer is designed to index data from the Polkadot network.
- Ensure that the Docker containers are running correctly by checking the logs:
  `docker-compose logs -f`

## Project Structure

.
├── web
│ ├── components
│ │ ├── ConnectWalletModal.tsx
│ │ ├── FileUploader.tsx
│ │ └── ...
│ ├── constants
│ │ └── networks.ts
│ ├── hooks
│ │ ├── useFileUploader.ts
│ │ └── useWallet.ts
│ ├── pages
│ │ ├── index.tsx
│ │ └── ...
│ ├── public
│ │ ├── logo.png
│ │ └── ...
│ ├── styles
│ │ └── globals.css
│ ├── utils
│ │ ├── truncateFileName.ts
│ │ └── ...
│ ├── .env.sample
│ └── ...
└── indexer
├── docker-compose.yml
├── .env.sample
└── ...

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

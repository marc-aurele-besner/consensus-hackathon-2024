# File On-chain

This is my submission for the [Consensus 2024 Hackathon](https://consensus2024.coindesk.com/hackathon/). The project aims to demonstrate how files can be uploaded to the Polkadot network using Substrate and Subsquid. The project consists of a Next.js web application that allows users to upload files to the Polkadot network and a SubSquid indexer that indexes the uploaded files.

The demo of this project is available at [https://consensus-hackathon-2024.vercel.app//](https://consensus-hackathon-2024.vercel.app/).

This project consists of two main components:

1. A Next.js web application located in the `web` directory.
2. A set of SubSquid indexers located in the `indexers` directory. (One for each supported network)

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

1. Navigate to the `indexers` directory:
   `cd indexers/<network>`

2. Copy the example environment file and modify it as needed:
   `cp .env.sample .env`

3. Install the required dependencies:
   `npm ci`

4. Start the SubSquid Docker:
   `sqd up`

5. Start the indexing process:
   `sqd process`

6. Start the graphql endpoint/playground:
   `sqd serve`

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

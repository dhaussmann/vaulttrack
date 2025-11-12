# VaultTrack

A minimalist, modern web application to display the real-time Total Value Locked (TVL) of a Paradex vault, updated every 30 minutes.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dhaussmann/vaulttrack)

VaultTrack is a sleek, minimalist web application designed to monitor the Total Value Locked (TVL) of a Paradex vault. It leverages Cloudflare Workers to periodically fetch data from the Paradex public API, ensuring the displayed information is refreshed every 30 minutes. The frontend is a visually stunning, single-page experience built with React and shadcn/ui, emphasizing clarity, elegance, and data-first design.

## Key Features

- **Real-time TVL Monitoring**: Displays the current Total Value Locked from the Paradex vault.
- **Automatic Refresh**: Data is automatically fetched and updated every 30 minutes using a Cloudflare Worker.
- **Minimalist UI**: A clean, single-page interface built for clarity and focus.
- **Serverless Backend**: Powered by Cloudflare Workers for high performance and scalability.
- **Modern Frontend**: Built with React, Vite, and styled with Tailwind CSS & shadcn/ui.
- **Light & Dark Mode**: Includes a theme toggler for user preference.
- **Responsive Design**: Flawless experience across all device sizes.

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React, Zustand
- **Backend**: Cloudflare Workers, Hono
- **Deployment**: Cloudflare Pages & Wrangler
- **Package Manager**: Bun

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- The [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated: `bunx wrangler login`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/vault_track.git
    cd vault_track
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

## Development

To run the application locally in development mode, which includes hot-reloading for the frontend and the local worker environment:

```bash
bun dev
```

This will start the Vite development server for the React application and a local instance of the Cloudflare Worker. You can access the application at `http://localhost:3000` (or the port specified in your terminal).

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application source code, including pages, components, and hooks.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono. This is where API routes and logic reside.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety.

## Deployment

This project is configured for seamless deployment to Cloudflare.

### Manual Deployment via CLI

You can deploy the application directly from your terminal using the Wrangler CLI.

1.  **Build the project:**
    This step is included in the deploy script.

2.  **Deploy the application:**
    The following command will build the frontend, and then deploy both the static assets and the worker to your Cloudflare account.

    ```bash
    bun run deploy
    ```

### One-Click Deployment

You can also deploy this project with a single click using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dhaussmann/vaulttrack)
# Willovate AI Automation Engine

Local app preview: http://localhost:3000

GitHub repository: https://github.com/nayan2005-Nam/Willovate-Ai-Automation-Engine

> Google AI Studio deployment note: this project is ready to be adapted for Vercel deployment. The app is structured for a modern web deployment flow and can be configured to run with environment variables in Vercel instead of the AI Studio environment.

This project is designed for creating, testing, and evaluating AI-powered automation workflows across CRM, product, and business-process scenarios. It combines a React frontend, a lightweight Express backend, and Gemini-powered workflow generation to turn natural-language instructions into structured automation steps.

## Overview

This project includes:

- A React dashboard for automation workflow orchestration
- A studio interface for natural-language instructions
- Vision-based inspection and workflow generation
- Dataset-driven testing scenarios
- Model evaluation and architecture views
- A lightweight Express API for deployment and health checks
- Google AI Studio-compatible configuration for Gemini API access

## Tech Stack

- React 19
- Vite
- TypeScript
- Express
- Gemini API via Google GenAI
- Tailwind-based UI styling

## Features

- Multi-language instruction handling: English, Hindi, and Hinglish
- Action-based workflow generation for browser automation
- Customer, product, and report simulation data
- Example automation datasets and evaluation screens
- Health endpoint support for deployment environments

## Screenshot

Add your app screenshots here to show the dashboard, studio workflow, and automation views.

```md
![Dashboard](./assets/dashboard.png)
![Studio](./assets/studio.png)
![Evaluation](./assets/evaluation.png)
```

## How it works

1. The user enters a natural-language business instruction in the studio.
2. The app interprets the instruction and identifies the automation intent, entities, and required fields.
3. It translates the request into structured automation actions such as open page, click, enter text, and verify result.
4. The workflow is presented in the UI for review, simulation, and testing.
5. The backend and evaluation layers help validate the flow before execution.

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm
- A valid Gemini API key

### Install dependencies

```bash
npm install
```

### Configure environment

Create a local environment file from the sample configuration:

```bash
copy .env.example .env
```

Then update the values in `.env`:

```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

### Run the app locally

```bash
npm run dev
```

The app starts the Express server and serves the frontend locally.

## Production build

```bash
npm run build
```

## Start the production build

```bash
npm start
```

## Project structure

```text
.
├── src/                # React application source
├── server.ts           # Express server and AI orchestration logic
├── index.html          # App entry
├── package.json        # Scripts and dependencies
├── .env.example        # Example environment variables
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── README.md           # Project documentation
```

## Notes

This project is intended as an AI automation studio prototype and can be extended with real browser automation drivers, workflow execution backends, and additional evaluation tooling.

## Vercel deployment

To deploy this project on Vercel:

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.example` in the Vercel project settings.
4. Use the default build settings for the Vite + Express project.
5. Deploy the app and verify the health route and frontend render correctly.

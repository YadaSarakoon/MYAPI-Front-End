# MyAPI

**Shipping API Developer Portal**

MyAPI is a web-based developer portal for integrating shipping services into E-Commerce platforms and business applications. It provides tools for exploring API documentation, testing requests, and managing API access throughout the development lifecycle.

This repository contains the frontend application built with React, TypeScript, and Vite.

## Features

* **Authentication** — Sign in using Google Authentication with Firebase.
* **API Documentation** — Explore API endpoints, request parameters, and response structures.
* **Sandbox** — Test API requests in a development environment.
* **Production** — Manage API credentials and monitor usage.
* **Billing** — View account balance and transaction history.
* **Dashboard** — Access key information and navigate between services.


## Tech Stack

| Technology              | Usage                                           |
| ----------------------- | ----------------------------------------------- |
| React                   | Component-based UI development                  |
| TypeScript              | Static typing and improved code maintainability |
| Vite                    | Development server and production build         |
| Firebase Authentication | User authentication                             |
| Git                     | Version control                                 |

## Project Structure

```text
src/
├── assets/       # Static assets such as images and icons
├── components/   # Shared and reusable UI components
├── config/       # Application configuration (e.g. Firebase)
├── pages/        # Page-level components
├── services/     # API requests and external service logic
├── types/        # Shared TypeScript interfaces and types
├── App.tsx       # Application layout and route configuration
├── main.tsx      # Application entry point
└── index.css     # Global styles
```

## Requirements

* Node.js (LTS recommended)
* npm
* Git

## Installation

Clone the repository:

```bash
git clone https://github.com/YadaSarakoon/MYAPI-Front-End.git
cd MYAPI-Front-End
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, typically `http://localhost:5173`.

## Environment Variables

The application uses Firebase Authentication. Configure the following variables in `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with the configuration from your Firebase project.

**Do not commit `.env.local` or sensitive credentials to version control.**

## Available Scripts

| Command           | Description                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`     | Start the local development server                                                            |
| `npm run build`   | Type-check and build the application for production, according to the configured build script |
| `npm run preview` | Preview the production build locally                                                          |

Check `package.json` for the complete list of available scripts.

## Development Notes

* Follow the existing component structure when adding new features.
* Keep reusable UI elements in `components/`.
* Place page-specific logic in the relevant page component.
* Separate API communication from UI components where appropriate.
* Define shared data structures using TypeScript types or interfaces.
* Handle loading, success, and error states consistently.
* Keep environment-specific configuration outside the source code.
* Verify changes locally before committing.

## Build

Generate the production build:

```bash
npm run build
```

The generated files are placed in the `dist/` directory by default.

To preview the build locally:

```bash
npm run preview
```


---


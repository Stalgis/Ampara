# Class Project Server

This server provides authentication endpoints for a React Native client.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and adjust values.

## Environment Variables

- `PORT`: Port the server listens on.
- `CLIENT_URL`: URL of the React Native app allowed by CORS.

## API Routes

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Log in an existing user.
- `POST /api/auth/reset` – Request a password reset.

All routes accept and return JSON.

## Running

`npm start`

# SlackConnect-frontend
This is the frontend client for the Slack Connect application. It provides a user interface for connecting to a Slack workspace, sending messages, and managing scheduled messages.

Technology Stack
Framework: React

Language: TypeScript

Styling: Tailwind CSS

Tooling: Vite

Features
Responsive Design: The UI is fully responsive and works on both mobile and desktop devices.

OAuth Flow: Provides a "Connect to Slack" button that initiates the authorization process.

Message Form: A form with a channel selector, message input, and options for immediate or scheduled sending.

Scheduled Messages List: Displays a list of all messages scheduled for future delivery, with an option to cancel them.

Setup Instructions
Ensure the backend is running on http://localhost:4000.

Install dependencies:

npm install

Start the development server:

npm run dev

The application will be available at http://localhost:5173.

Components
App.tsx: The main entry point of the application. It manages the global state (connection status, scheduled messages) and conditionally renders the Connect button or the main app UI.

MessageForm.tsx: The component for composing and sending/scheduling messages. It fetches channels from the backend and sends message data.

ScheduledMessagesList.tsx: A component that fetches and displays a list of scheduled messages from the backend.

Modal.tsx: A reusable modal component used to confirm message cancellations.

Architectural Overview

Frontend: The frontend is a single-page application built with React and TypeScript. It uses a MessageForm component for user input and a ScheduledMessagesList component to display pending messages. All styling is handled by Tailwind CSS, making the UI fully responsive.

Challenges & Learnings
OAuth 2.0 Flow: Successfully implementing the OAuth 2.0 flow, especially handling the redirect and token exchange, was a key challenge.

Token Management: The automatic refresh token logic was critical to ensuring the application could maintain a connection to Slack without user re-authentication.

Full-Stack Integration: Aligning the frontend API calls with the backend's routes and data models required careful coordination to ensure a seamless flow of information.

Environment Variable Management: A significant challenge was ensuring that the .env variables were correctly loaded and accessed across different parts of the application, especially with the TypeScript transpilation process.

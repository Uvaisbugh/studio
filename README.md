# Aura Vision: AI-Powered Mood Tracking

Aura Vision is a Next.js web application that uses generative AI to analyze your mood from a selfie. Upload or capture a photo, and the app will detect your emotional state, provide a reason for its analysis, and suggest personalized activities or content to match your mood.

## Features

- **AI-Powered Emotion Analysis**: Leverages the Gemini model through Genkit to analyze facial expressions in selfies and determine the user's emotion.
- **Personalized Suggestions**: Provides tailored recommendations (e.g., music, activities) based on the detected mood.
- **Webcam & File Upload**: Users can either upload an existing selfie or take a new one directly through their device's webcam.
- **Mood History**: Keeps a log of past emotion analyses, allowing users to track their mood over time.
- **Journaling**: Offers a space for users to write down their thoughts and reflections.
- **Modern UI**: Built with Next.js, React, and ShadCN UI components for a clean and responsive user experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI/ML**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini model](https://deepmind.google/technologies/gemini/)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Running the Development Server

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Genkit and Next.js development servers**:
    This project requires two development servers to run concurrently: one for the Genkit AI flows and one for the Next.js frontend.

    - In your first terminal, start the Genkit server:
      ```bash
      npm run genkit:watch
      ```
    - In a second terminal, start the Next.js development server:
      ```bash
      npm run dev
      ```

3.  **Open the app**:
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

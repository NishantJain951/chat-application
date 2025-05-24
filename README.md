# Chat App
[A real-time chat application built with Next.js and powered by Gemini AI.]

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** v20.11.0 or higher
*   **npm:** v10.2.4 or higher
*   **Git:** For cloning the repository.
*   **A Gemini API Key:** Obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NishantJain951/chat-application.git
    cd chat-application
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    This project requires a Gemini API Key to function.

    *   **Create a local environment file:**
        *If you don't have an `.env.local` file, simply create a new file named `.env.local` in the project root.*

    *   **Add your Gemini API Key to `.env.local`:**
        Open the newly created `.env.local` file and add your API key.
        ```ini
        # .env.local (for client-side exposure)
        # NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
        ```
        *Please ensure you are using the correct variable name as expected by the application code.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000] in your browser to see the application.
---

## Testing

### Unit & Integration Tests (Jest)

This project uses Jest for unit and integration testing.

1.  **Ensure development dependencies are installed:**
    Jest and its related dependencies should be listed in your `devDependencies` in `package.json` and installed during `npm install`. If not, you might need to install them:
    ```bash
    npm install --save-dev jest @types/jest ts-jest identity-obj-proxy jest-environment-jsdom  @testing-library/jest-dom
    ```

2.  **Run tests:**
    ```bash
    npm run test
    ```
    To run tests in watch mode:
    ```bash
    npm run test:watch
    ```

### End-to-End Tests (Cypress)

Cypress is used for end-to-end testing.

1.  **Ensure Cypress is installed:**
    Cypress should be listed in your `devDependencies` in `package.json`. If you need to install it manually for the first time or ensure it's set up:
    ```bash
    npm install --save-dev cypress
    npx cypress install # This step might not always be necessary if npm install handles it.
    ```

2.  **Open Cypress Test Runner:**
    Make sure your development server (`npm run dev`) is running on 3000 port in a separate terminal. Then, open the Cypress Test Runner:
    ```bash
    npx cypress open
    ```
    This will open the Cypress application where you can select and run your e2e tests.
---

## [Built With]

*   [Next.js](https://nextjs.org/) - React Framework
*   [Gemini API](https://ai.google.dev/docs) - AI Model
*   [Jest](https://jestjs.io/) - Testing Framework
*   [Cypress](https://www.cypress.io/) - E2E Testing Framework


## Vercal Link
* [Vercel-chat-app](https://chat-application-pied-alpha.vercel.app/) - Deployed on Vercel
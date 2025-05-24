## Getting Started

### Prerequisites

- Node.js (version v20.11.0 or higher)
- npm
- A Gemini API Key (obtainable from https://aistudio.google.com/app/apikey)

### Installation & Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-project.git
    cd your-project
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install or pnpm install
    ```
3.  Set up environment variables:
    - Copy the example environment file:
      ```bash
      cp .env.example .env.local
      ```
    - Open `.env.local` and add your Gemini API Key:
      ```ini
      NEXT_PUBLIC_API_KEY=your_actual_gemini_api_key_here
      ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Testing the project (jest)

1.  Install dependencies:
    ```bash
    npm install jest
    npm install --save-dev @types/jest
    ```
2.  Run the development server:
    ```bash
    npm run test
    # or npm run test:watch
    ```

    ### Testing the project (e2e)

1.  Install dependencies:
    ```bash
    npm install --save-dev cypress
    npx cypress install
    ```
2.  Run the development server:
    ```bash
    npx cypress open
    ```
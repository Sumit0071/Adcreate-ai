# AdCreate-AI

![AdCreate-AI Logo](https://via.placeholder.com/200x60?text=AdCreate-AI+Logo)

**AdCreate-AI** is an AI-powered platform that allows businesses to create high-converting ads in seconds. Transform your business profile into multiple ad variations with custom copy and AI-generated images tailored to your target audience.

---

## Features

* **AI-Powered Ad Generation**: Generate multiple ad variations automatically.
* **Custom Images**: AI-generated images tailored to your brand or upload your own.
* **Smart Targeting**: Ads are tailored to your niche and audience.
* **WhatsApp Chat Import**: Create ads directly from your chat data.
* **Multi-step Workflow**: Simple process from profile creation → instructions → generate & download.
* **Dark/Light Mode**: Toggle themes for a personalized experience.
* **Responsive Design**: Works seamlessly on mobile and desktop.

---

## Tech Stack

| Frontend                                                                                                   | Backend                                                                                                    | Database                                                                                                            | AI / ML                                                                                                 | Deployment                                                                                              |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)      | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)          | ![OpenAI](https://img.shields.io/badge/OpenAI-000000?style=for-the-badge\&logo=openai\&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white) |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge)                             | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge\&logo=postgresql\&logoColor=white) |

---

## Screenshots

<!-- Add screenshots of the app here -->

![Home Page](https://via.placeholder.com/800x400?text=Home+Page)
![Ad Generation Modal](https://via.placeholder.com/800x400?text=Ad+Generation+Modal)

---

## Getting Started

### Prerequisites

* Node.js >= 22.x
* npm or yarn
* MongoDB / PostgreSQL instance
* Gemini APi Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/adcreate-ai.git
cd adcreate-ai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the backend and frontend directories:

```env
# Backend
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret

# Frontend (if using Vite)
VITE_OPENAI_API_KEY=your_openai_api_key
BACKEND_URL=http://localhost:5000
```

### Running the App

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

The app should now be running at `http://localhost:3000`.

---

## Usage

1. Sign up or log in.
2. Create your business profile.
3. Optionally, import WhatsApp chats for ad ideas.
4. Generate AI-powered ads with multiple variations.
5. Download and use ads for campaigns.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

MIT License © 2025 AdCreate-AI

---



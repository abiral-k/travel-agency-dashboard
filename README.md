# Travel Agency Dashboard

A modern, full-stack dashboard application for managing travel agency operations. Built with React Router v7, TypeScript, and TailwindCSS for a responsive, production-ready experience.


## Features

- 🤖 AI-powered trip itinerary generator
- 📊 Admin dashboard with trip and user management
- 📈 User growth metrics and trip analytics
- 📉 Interactive charts and trip statistics table
- 🗺️ Detailed trip overview
- 🎨 Responsive UI with a modern design
- 🔐 Secure authentication and data management
- 🏗️ Modular code architecture with reusable components

## Tech Stack

- **React 19** - Latest version with enhanced performance and features
- **React Router v7** (Framework Mode) - File-based routing for seamless full-stack development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Lightning-fast build tool with instant HMR
- **Appwrite** - Open-source Backend-as-a-Service for authentication & database
- **Syncfusion** - Enterprise-grade UI components and data visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/abiral-k/travel-agency-dashboard.git
cd travel-agency-dashboard
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

## Project Structure

```
travel-agency-dashboard/
├── app/                    # Application source code
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── package.json            # Project dependencies
├── react-router.config.ts  # React Router configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Syncfusion License
VITE_SYNCFUSION_LICENSE_KEY=

# Appwrite Configuration
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_API_ENDPOINT=
VITE_APPWRITE_API_KEY=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_USERS_COLLECTION_ID=
VITE_APPWRITE_ITINERARY_COLLECTION_ID=

# AI & Image Services
GEMINI_API_KEY=
UNSPLASH_ACCESS_KEY=
```

## Learn More

For more information about React Router and its capabilities, visit the [official documentation](https://reactrouter.com/).

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/abiral-k/travel-agency-dashboard/issues).

---

Built with ❤️ by [Abiral K](https://github.com/abiral-k)

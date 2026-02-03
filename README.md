# EDU PATH - Kenyan Career Guidance Platform

A comprehensive KCSE career guidance platform built with React, TypeScript, and Vite, featuring AI-powered course recommendations and M-Pesa payment integration.

## 🚀 Features

- **AI-Powered Career Advice**: Gemini AI integration for personalized career guidance
- **University Registry**: Comprehensive database of Kenyan universities and courses
- **Grade Analysis**: KCSE grade input and merit calculation
- **Payment Integration**: Simulated M-Pesa STK Push for premium features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Admin Dashboard**: Transaction monitoring and system management

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **PDF Generation**: jsPDF
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edu-path
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your API key for local serverless testing (server only):
   ```
   API_KEY=your_gemini_api_key_here
   ```

> Note: For production, set the `API_KEY` secret in your Vercel project (Environment > Add) and do not expose it as `VITE_***` in client builds.

4. **Start development server**
   ```bash
   npm run dev
   ```

   **Run serverless endpoints locally** 🖥️

   This project uses Vercel-style serverless endpoints under the `api/` directory. To test these endpoints locally use the Vercel CLI (no install required):
   ```bash
   npx vercel dev
   ```

   By default `vercel dev` will serve the `/api/*` routes locally on a separate port, and respects local environment variables. Ensure you have an `.env.local` with `API_KEY` configured for AI features. You can use the provided `.env.local.example` as a starting point.

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel** ✅
   - Push the repo to GitHub and import the project in Vercel.

2. **Environment Variables / Secrets** 🔐
   - Add a server-side environment variable named `API_KEY` (the Gemini API key) in your Vercel Project > Settings > Environment Variables. Do NOT expose it as a `VITE_` prefixed variable.
   - Alternatively, create a Vercel Secret named `api_key` and reference it in `vercel.json` (this project uses `API_KEY: "@api_key"`).
   - If you receive a `NOT_FOUND`/`MODEL_NOT_FOUND` error from the AI server, your API key likely lacks access to the default model (`gemini-3-flash-preview`). Set a different model using the `MODEL_NAME` environment variable in Vercel (for example, a model your account can access). You can also set `MODEL_FALLBACKS` to a comma-separated list of model names (e.g. `MODEL_FALLBACKS=gemini-3-flash-preview,gemini-1.5`) — the server will try them in order and report which one succeeded via `/api/health`.

3. **Build Settings** ⚙️
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Serverless Endpoints** 💡
   - This project exposes serverless endpoints at `/api/gemini/*` and `/api/payment/*` for secure AI and payment operations. Keep `API_KEY` only on the server (Vercel secrets/environment variables).

### Manual Build

```bash
npm run build
npm run preview
```

## 🔐 Security Notes

- API keys are properly validated before use
- Cryptographically secure random generation for payments
- Client-side admin authentication (demo purposes only)
- Phone number validation for Safaricom numbers

## 📁 Project Structure

```
EDU PATH/
├── pages/           # React components for different pages
├── services/        # API services (Gemini, Payment)
├── utils/           # Utility functions
├── types.ts         # TypeScript type definitions
├── constants.ts     # Application constants
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
├── vite.config.ts   # Vite configuration
└── vercel.json      # Vercel deployment config
```

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, contact via WhatsApp or email as configured in the application.
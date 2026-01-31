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
   
   Update `.env.local` with your API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push code to GitHub
   - Import project in Vercel dashboard
   - Configure environment variables

2. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_API_KEY=your_gemini_api_key
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

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
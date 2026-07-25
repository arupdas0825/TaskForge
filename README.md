# TaskForge

A cloud-backed task management platform built with Next.js 15, React 19, Firebase Authentication (Google Sign-In), Cloud Firestore, Cloud Functions, Twilio (WhatsApp & OTP), SendGrid, and Google Calendar / Tasks integration.

## Key Architecture & Features

- 🔐 **Forced Google Sign-In**: Authenticate securely using Google OAuth via Firebase Auth.
- ☁️ **Cloud Firestore Data Scoping**: All user tasks, projects, labels, and profile settings are stored securely in Firestore, scoped per user (`/users/{uid}/...`).
- 📱 **WhatsApp & Email Reminders**: Scheduled reminders delivered automatically via Cloud Functions, Twilio (WhatsApp), and SendGrid.
- 🔒 **Phone Number Verification**: Mandatory E.164 OTP verification via Twilio Verify before activating WhatsApp notifications.
- ⛔ **WhatsApp Opt-Out Support**: Inbound webhook support handling "STOP" messages from users to instantly opt-out.
- 📅 **Google Calendar & Tasks Sync**: Auto-sync scheduled tasks into the user's primary Google Calendar and Google Tasks.
- 📊 **Productivity Analytics & Insights**: Real-time metrics, completion trends, and priority breakdowns.
- 🎨 **Modern Dark/Light Themes**: Dynamic dark glassmorphism aesthetic built with Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router) + React 19
- **Backend & Database**: Firebase Auth + Cloud Firestore + Cloud Functions (Node.js)
- **Messaging & OTP**: Twilio Verify + Twilio WhatsApp API + SendGrid Mail
- **Integrations**: Google Calendar API v3 + Google Tasks API v1
- **State & UI**: TanStack React Query + Zustand + Tailwind CSS + Framer Motion + Sonner

## Environment & Setup

### Client Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend & Cloud Functions Secrets

Deploy Cloud Functions with the following secrets configured in Firebase Console / Secret Manager:

- `TWILIO_ACCOUNT_SID`: Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token
- `TWILIO_VERIFY_SID`: Twilio Verify Service SID
- `TWILIO_WHATSAPP_FROM`: WhatsApp sender phone number (e.g., `+14155238886`)
- `SENDGRID_API_KEY`: SendGrid API Key

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying Rules & Cloud Functions

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Cloud Functions
firebase deploy --only functions
```

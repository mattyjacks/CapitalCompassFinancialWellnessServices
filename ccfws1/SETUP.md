# Capital Compass Financial & Wellness Services - Post Generator

## Overview

This is an internal-use-only web application for Capital Compass Financial and Wellness Services. It provides a powerful AI-driven social media post generator using OpenAI's API to create platform-specific content for LinkedIn, Facebook, Instagram, and TikTok.

## Features

- **Password-Protected Access**: Simple password authentication (password: "password")
- **AI Post Generation**: Uses OpenAI's Claude 3.5 Sonnet to generate platform-specific posts
- **Multi-Platform Support**: Generate optimized posts for:
  - LinkedIn (professional, 150-200 words)
  - Facebook (engaging, 100-150 words)
  - Instagram (captivating captions with hashtags)
  - TikTok (trendy, 50-100 characters)
- **AI Chatbot Assistant**: Interactive chatbot to refine and improve generated posts
- **Postables Collection**: Local storage-based collection system to save and manage generated posts
- **Dark Mode Support**: Full dark mode support for comfortable use
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (set as environment variable on Vercel)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env.local` file in the project root:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000 in your browser
   - You'll be redirected to the login page
   - Enter password: `password`
   - Access the dashboard

### Production Deployment (Vercel)

1. **Set Environment Variables on Vercel**
   - Go to your Vercel project settings
   - Add `OPENAI_API_KEY` to Environment Variables
   - The API key will be securely stored and used at runtime

2. **Deploy**
   ```bash
   npm run build
   npm run start
   ```

## Usage

### Generating Posts

1. Enter a topic or content idea in the text area
2. Select one or more platforms (LinkedIn, Facebook, Instagram, TikTok)
3. Click "Generate Posts"
4. The AI will create platform-optimized posts

### Refining Posts

1. After generation, the AI Assistant will appear
2. Ask for refinements like:
   - "Make this shorter"
   - "Add more emojis"
   - "Make it more professional"
   - "Add a call-to-action"
   - Any other specific requests

### Managing Postables

- Generated posts are automatically saved to the Postables Collection
- View posts by platform using the platform tabs
- Copy posts to clipboard with one click
- Delete individual posts or clear all posts for a platform
- Posts persist in browser local storage

## Technical Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: shadcn/ui components
- **AI API**: OpenAI (Claude 3.5 Sonnet)
- **Storage**: Browser Local Storage
- **Icons**: Lucide React

## API Routes

### POST /api/generate-posts
Generates social media posts for specified platforms.

**Request:**
```json
{
  "topic": "Financial wellness tips for millennials",
  "platforms": ["linkedin", "facebook", "instagram", "tiktok"]
}
```

**Response:**
```json
{
  "linkedin": "Generated LinkedIn post...",
  "facebook": "Generated Facebook post...",
  "instagram": "Generated Instagram caption...",
  "tiktok": "Generated TikTok caption..."
}
```

### POST /api/chat
Interactive chatbot for refining posts.

**Request:**
```json
{
  "message": "Make this post shorter",
  "posts": [...],
  "conversationHistory": [...]
}
```

**Response:**
```json
{
  "response": "Here's a shorter version..."
}
```

## Security & Compliance

- **Internal Use Only**: This application is for internal use by Capital Compass Financial and Wellness Services only
- **Password Protection**: Simple password authentication (suitable for internal use)
- **API Key Security**: OpenAI API key is stored securely in Vercel environment variables
- **No Data Persistence**: Generated posts are stored only in browser local storage
- **Disclaimer**: Clear disclaimer displayed on login and dashboard

## File Structure

```
ccfws1/
├── app/
│   ├── api/
│   │   ├── generate-posts/route.ts    # Post generation endpoint
│   │   └── chat/route.ts              # Chatbot endpoint
│   ├── dashboard/page.tsx             # Main dashboard
│   ├── login/page.tsx                 # Login page
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Redirect to login
├── components/
│   ├── post-generator.tsx             # Post generation UI
│   ├── chatbot.tsx                    # Chatbot component
│   ├── postables-collection.tsx       # Postables display
│   ├── password-login-form.tsx        # Login form
│   └── ui/                            # UI components
├── lib/
│   └── utils.ts                       # Utility functions
└── package.json
```

## Troubleshooting

### "OpenAI API key not configured"
- Ensure `OPENAI_API_KEY` is set in environment variables
- On Vercel, check project settings > Environment Variables
- Locally, create `.env.local` file with the key

### Posts not generating
- Check that OpenAI API key is valid
- Ensure you have API credits available
- Check browser console for error messages

### Postables not saving
- Check browser's local storage is enabled
- Clear browser cache if experiencing issues
- Postables are stored per browser/device

## Support

For issues or questions, contact the development team.

## License

Internal use only - Capital Compass Financial and Wellness Services

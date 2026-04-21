# Capital Compass Financial & Wellness Services

Internal web application for managing and generating social media content.

## Projects

### Social Media Post Generator (`ccfws1/`)

An AI-powered internal tool for generating platform-specific social media posts using OpenAI's Claude 3.5 Sonnet model.

#### Features

- **Password-Protected Dashboard**: Secure access with simple password authentication
- **AI Post Generation**: Generate optimized posts for multiple platforms:
  - LinkedIn (professional, 150-200 words)
  - Facebook (engaging, 100-150 words)
  - Instagram (captivating captions with hashtags)
  - TikTok (trendy, 50-100 characters)
- **Interactive AI Chatbot**: Refine and improve generated posts with natural language requests
- **Postables Collection**: Save and manage generated posts with local storage persistence
- **Dark Mode Support**: Full dark/light theme support
- **Responsive Design**: Works seamlessly on desktop and mobile

#### Quick Start

```bash
cd ccfws1
npm install
npm run dev
```

Access at `http://localhost:3000`
- Login password: `password`

#### Environment Setup

Create `.env.local` in `ccfws1/`:
```
OPENAI_API_KEY=your-openai-api-key-here
```

For Vercel deployment, add `OPENAI_API_KEY` to project environment variables.

#### Tech Stack

- Next.js 16 with TypeScript
- Tailwind CSS with dark mode
- shadcn/ui components
- OpenAI API (Claude 3.5 Sonnet)
- Browser Local Storage
- Lucide React icons

#### Key Files

- `app/dashboard/page.tsx` - Main dashboard
- `app/login/page.tsx` - Login page
- `app/api/generate-posts/route.ts` - Post generation endpoint
- `app/api/chat/route.ts` - Chatbot endpoint
- `components/post-generator.tsx` - Post generation UI
- `components/chatbot.tsx` - Interactive chatbot
- `components/postables-collection.tsx` - Postables management

#### Security & Compliance

- **Internal Use Only**: Restricted to Capital Compass staff
- **Password Protection**: Simple authentication suitable for internal use
- **Secure API Keys**: OpenAI keys stored in Vercel environment variables only
- **No Data Persistence**: Posts stored only in browser local storage
- **Compliance Disclaimer**: Clear internal-use-only notice on all pages

#### Deployment

The application is configured for Vercel deployment. See `SETUP.md` in `ccfws1/` for detailed deployment instructions.

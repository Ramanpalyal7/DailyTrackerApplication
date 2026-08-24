Here's the complete README.md file:

```markdown
# LapWork Website

The official marketing and download portal for LapWork, a local-only Windows desktop productivity application (macOS coming soon).

## 🎯 Project Overview

This website serves as the primary download and marketing platform for LapWork. Since the app runs entirely locally with no user accounts or server data, the website focuses on:

- **Showcasing** the application and its features
- **Delivering** seamless direct downloads
- **Tracking** lightweight analytics (page views, download clicks, active visitors)
- **Auto-syncing** with GitHub Releases for latest version updates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
└────────────┬────────────────────────┬───────────────────────┘
             │                        │
             ▼                        ▼
┌─────────────────────┐    ┌─────────────────────┐
│     Next.js App     │    │  Cloudflare Worker   │
│      (Vercel)       │    │   (lapwork-downloads)│
│                     │    │                      │
│  - Landing Page     │    │  - Streams installer │
│  - API Routes       │    │  - Proper headers    │
│  - Analytics        │    │  - Edge delivery     │
└──────┬──────┬───────┘    └──────────┬───────────┘
       │      │                       │
       ▼      ▼                       ▼
┌────────────┐ ┌──────────────┐ ┌─────────────────┐
│    Neon    │ │   Upstash    │ │ Cloudflare R2   │
│  Postgres  │ │    Redis     │ │  (lapwork-      │
│            │ │              │ │   releases)     │
│ - Releases │ │ - Rate limit │ │                 │
│ - PageViews│ │ - Active     │ │ - .exe files    │
│ - Downloads│ │   visitors   │ │ - .dmg files    │
└────────────┘ └──────────────┘ └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **Neon Postgres** database (free tier)
- **Upstash Redis** database (free tier)
- **Cloudflare** account (free tier)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Ramanpalyal7/DailyTrackerApplication.git
cd DailyTrackerApplication

# Install dependencies
bun install
# or
npm install
```

### Step 2: Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual credentials
```

### Step 3: Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database (creates tables)
bunx prisma db push

# Or if using migrations
bunx prisma migrate dev
```

### Step 4: Run the Application

```bash
# Start development server
bun run dev
# or
npm run dev

# Visit http://localhost:3000
```

### Step 5: Test Everything

Visit the test page at:
```
http://localhost:3000/test-analytics
```

This page tests:
- ✅ Page view tracking
- ✅ Heartbeat system (active visitors)
- ✅ Live analytics stats
- ✅ Download functionality
- ✅ Release info fetching

## 📦 Database Setup

### Neon Postgres

1. Create a free database at [Neon](https://neon.tech)
2. Copy the connection string
3. Add to `.env` as `DATABASE_URL`

### Prisma Schema

The schema is in `prisma/schema.prisma`:

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `AppRelease` | Stores latest release metadata | version, platform, fileName, downloadUrl |
| `DownloadEvent` | Tracks download clicks | platform, version, visitorId |
| `PageView` | Tracks page visits | path, visitorId |
| `DailyStat` | Pre-calculated daily totals | date, totalVisits, totalDownloads |

### Database Relationships

```
AppRelease (Latest version per platform)
    ↓
DownloadEvent (Tracks when users download)

PageView (Tracks when users visit)

DailyStat (Aggregated daily metrics)
```

## 🔌 API Endpoints

### 📊 Analytics Endpoints

#### 1. Track Page View
```http
POST /api/analytics/pageview
Content-Type: application/json

{
  "path": "/home",
  "visitorId": "visitor_abc123"
}
```

**Response:**
```json
{
  "success": true
}
```

#### 2. Heartbeat (Active Visitors)
```http
POST /api/analytics/heartbeat
Content-Type: application/json

{
  "visitorId": "visitor_abc123",
  "path": "/home"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeVisitors": 3,
    "ttl": 60,
    "visitorId": "visitor_abc123"
  },
  "timestamp": "2026-08-24T10:00:00Z"
}
```

#### 3. Get Analytics Stats
```http
GET /api/analytics/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeVisitors": 3,
    "totalPageViews": 150,
    "totalDownloads": 25,
    "today": {
      "date": "2026-08-24",
      "pageViews": 75,
      "downloads": 10
    }
  },
  "timestamp": "2026-08-24T10:00:00Z"
}
```

### 📥 Release Endpoints

#### Get Latest Release
```http
GET /api/releases/latest
```

**Response:**
```json
{
  "windows": {
    "version": "v2.2.0",
    "fileName": "lapwork.Setup.2.2.0.exe",
    "downloadUrl": "https://github.com/...",
    "size": 108000000,
    "publishedAt": "2026-08-20T10:00:00Z"
  },
  "macos": null
}
```

### ⬇️ Download Endpoint

#### Download Latest Version
```http
GET /api/download?platform=windows&visitorId=visitor_abc123
```

**Behavior:**
1. Logs download event in database (background)
2. Redirects to Cloudflare Worker (302)
3. Worker streams file from R2

**Parameters:**
- `platform`: `windows` or `macos`
- `visitorId`: Anonymous visitor ID (optional)

## ☁️ Cloudflare Setup

### R2 Storage Setup

1. **Create Bucket:**
   - Go to Cloudflare Dashboard → R2
   - Create bucket named `lapwork-releases`
   - Set location (any)

2. **Upload Files:**
   - Upload installer files (e.g., `lapwork.Setup.2.2.0.exe`)
   - Keep file names consistent

3. **Generate API Tokens:**
   - Go to R2 → Manage API Tokens
   - Create token with read/write access
   - Save credentials for automation

### Worker Setup

1. **Create Worker:**
   - Go to Workers & Pages → Create
   - Name: `lapwork-downloads`
   - Deploy default worker

2. **Bind R2 Bucket:**
   - Go to Worker Settings → Bindings
   - Add R2 Bucket binding
   - Variable name: `LAPWORK_BUCKET`
   - Select: `lapwork-releases`

3. **Deploy Worker Code:**

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const fileName = decodeURIComponent(url.pathname.slice(1));
    
    if (!fileName) {
      return new Response('File name required', { status: 400 });
    }
    
    const object = await env.LAPWORK_BUCKET.get(fileName);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Length', object.size.toString());
    headers.set('Cache-Control', 'public, max-age=31536000');
    
    return new Response(object.body, { headers });
  },
};
```

4. **Get Worker URL:**
   - Format: `https://lapwork-downloads.your-subdomain.workers.dev`
   - Add to `.env` as `WORKER_URL`

## 📊 Client-Side Analytics

### Using the AnalyticsTracker

```typescript
"use client";
import { AnalyticsTracker } from "@/lib/analytics-tracker";

export function MyComponent() {
  const tracker = new AnalyticsTracker({
    heartbeatInterval: 30000, // 30 seconds
    onActiveVisitorsUpdate: (count) => {
      console.log(`Active visitors: ${count}`);
    },
    onError: (error) => {
      console.error('Analytics error:', error);
    },
  });

  // Track page view
  tracker.trackPageView("/my-page");

  // For download buttons
  const handleDownload = () => {
    const visitorId = tracker.getVisitorId();
    window.location.href = `/api/download?platform=windows&visitorId=${visitorId}`;
  };

  // Get stats
  const fetchStats = async () => {
    const stats = await tracker.getStats();
    console.log(stats);
  };

  return (
    <button onClick={handleDownload}>
      Download for Windows
    </button>
  );
}
```

### Visitor ID Management

- Stored in `localStorage` as `lapwork_visitor_id`
- Persists across sessions
- Anonymous (no personal data)
- Falls back to session ID if localStorage unavailable

## 🔄 Release Management

### Manual Release Sync

Sync the latest GitHub release to the database:

```bash
bun run releases:sync
```

**What it does:**
1. Fetches latest release from GitHub API
2. Identifies Windows (.exe/.msi) and macOS (.dmg/.pkg) assets
3. Upserts into `AppRelease` table
4. Updates version, filename, download URL, and size

### Release Flow

```
Developer publishes release on GitHub
    ↓
Run `bun run releases:sync`
    ↓
Database updated with latest version
    ↓
Website automatically shows latest version
```

### Future Automation (GitHub Actions)

Will automate:
- Upload to R2 on new release
- Database sync
- Cache invalidation

## 📁 Project Structure

```
lapwork-website/
├── prisma/
│   └── schema.prisma              # Database schema
│
├── scripts/
│   └── sync-releases.ts           # GitHub release sync
│
├── public/
│   └── assets/                    # Static assets
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/
│   │   │   │   ├── heartbeat/
│   │   │   │   │   └── route.ts   # Active visitor tracking
│   │   │   │   ├── pageview/
│   │   │   │   │   └── route.ts   # Page view tracking
│   │   │   │   └── stats/
│   │   │   │       └── route.ts   # Analytics stats
│   │   │   ├── download/
│   │   │   │   └── route.ts       # Download + redirect
│   │   │   └── releases/
│   │   │       └── latest/
│   │   │           └── route.ts   # Latest release
│   │   │
│   │   ├── test-analytics/
│   │   │   └── page.tsx           # Test page
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   │
│   ├── assets/                    # Images and SVGs
│   │
│   ├── components/                # Reusable components
│   │
│   ├── lib/
│   │   ├── analytics-tracker.ts   # Client-side analytics
│   │   ├── constants.ts           # Central constants
│   │   ├── prisma.ts              # Database client
│   │   ├── rate-limit.ts          # Rate limiting middleware
│   │   ├── redis.ts               # Redis client
│   │   ├── types.ts               # TypeScript types
│   │   └── utils.ts               # Utility functions
│   │
│   ├── sections/                  # Page sections
│   │   ├── CallToAction.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LogoTicker.tsx
│   │   ├── Pricing.tsx
│   │   ├── ProductShowcase.tsx
│   │   └── Testimonials.tsx
│   │
│   └── utils/
│       └── config.ts              # Central configuration
│
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint config
├── .gitignore                     # Git ignore rules
├── next.config.mjs                # Next.js config
├── package.json                   # Dependencies
├── prisma.config.ts               # Prisma config
├── tailwind.config.ts             # Tailwind config
└── tsconfig.json                  # TypeScript config
```

## 🛡️ Rate Limiting

All API endpoints are protected with rate limiting:

| Endpoint | Max Requests/Minute |
|----------|-------------------|
| `/api/analytics/pageview` | 30 |
| `/api/analytics/heartbeat` | 60 |
| `/api/analytics/stats` | 20 |
| `/api/download` | 30 |

**Implementation:** Uses Upstash Redis with sliding window algorithm.

**Behavior when limited:** Returns `429 Too Many Requests` with retry-after header.

## 🧪 Testing

### Test Page

Visit `/test-analytics` to test all functionality:

```
http://localhost:3000/test-analytics
```

### Curl Commands

```bash
# Test page view tracking
curl -X POST http://localhost:3000/api/analytics/pageview \
  -H "Content-Type: application/json" \
  -d '{"path":"/test","visitorId":"test-123"}'

# Test heartbeat
curl -X POST http://localhost:3000/api/analytics/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"visitorId":"test-123","path":"/test"}'

# Test stats
curl http://localhost:3000/api/analytics/stats

# Test latest release
curl http://localhost:3000/api/releases/latest

# Test download (check headers)
curl -I "http://localhost:3000/api/download?platform=windows&visitorId=test-123"
```

### Expected Results

1. **Page view**: Creates row in `PageView` table
2. **Heartbeat**: Adds visitor to Redis with 60s TTL
3. **Stats**: Returns counts from database and Redis
4. **Download**: Returns 302 redirect to Cloudflare Worker
5. **Latest release**: Returns version info from database

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Import in Vercel:**
   - Go to [Vercel](https://vercel.com)
   - New Project → Import your repository
   - Select the repo

3. **Configure Environment Variables:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string |
| `WORKER_URL` | Cloudflare Worker URL |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `GITHUB_REPO` | GitHub repository (owner/repo) |
| `GITHUB_TOKEN` | GitHub PAT (optional) |

4. **Deploy:**
   - Click Deploy
   - Vercel will build and deploy automatically

5. **Post-Deployment:**
```bash
# Run database migrations
bunx prisma db push

# Sync releases
bun run releases:sync
```

## 🔒 Security

### Secrets Management
- All secrets in `.env` (never committed)
- Environment variables for production
- No hardcoded credentials

### Rate Limiting
- All API endpoints protected
- Prevents abuse and spam
- Graceful degradation (fails open if Redis down)

### Privacy
- Anonymous visitor IDs only
- No personal data collected
- No cookies (uses localStorage)
- GDPR compliant

### Input Validation
- All API inputs validated
- Platform parameter checked
- Visitor ID type-checked

## 🐛 Troubleshooting

### Common Issues

#### Prisma Client Not Generated
```bash
Error: @prisma/client did not initialize yet
```
**Fix:**
```bash
bun run db:generate
```

#### Database Connection Failed
```
Error: Can't reach database server
```
**Fix:**
- Check `.env` has correct `DATABASE_URL`
- Whitelist your IP in Neon dashboard
- Check SSL mode

#### Redis Connection Failed
```
Error: Redis connection failed
```
**Fix:**
- Verify `UPSTASH_REDIS_REST_URL` and token
- Check if database is active

#### Download Not Working
```
Error: No release found for windows
```
**Fix:**
- Run `bun run releases:sync`
- Check if file exists in R2 bucket
- Verify Worker URL is correct

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Neon Postgres connection string |
| `WORKER_URL` | ✅ Yes | Cloudflare Worker URL |
| `UPSTASH_REDIS_REST_URL` | ✅ Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ Yes | Upstash Redis token |
| `GITHUB_REPO` | ⚠️ Optional | GitHub repository (for sync) |
| `GITHUB_TOKEN` | ⚠️ Optional | GitHub PAT (for higher rate limits) |
| `NODE_ENV` | ⚠️ Optional | Environment (default: development) |
| `PORT` | ⚠️ Optional | Port (default: 3000) |

## 🤝 Contributing

### Git Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description of change"

# Push to your branch
git push origin feature/your-feature

# Create a pull request on GitHub
```

### Code Style

- TypeScript for all new code
- Follow existing patterns
- Add comments for complex logic
- Use central config (`src/utils/config.ts`)
- Add types to `src/lib/types.ts`

## 📄 License

Private - All rights reserved
```
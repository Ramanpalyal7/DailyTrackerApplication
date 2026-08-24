import "dotenv/config"

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const config = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    
    // Cloudflare Worker (Public Download URL)
    CLOUDFLARE_WORKER_URL: process.env.WORKER_URL || "https://lapwork-downloads.srivastavarishabh2001.workers.dev",

    // Cloudflare R2 (S3 API Credentials - used later for auto-uploading files)
    CLOUD_FLARE_R2_ACCESS_KEY_ID: process.env.CLOUD_FLARE_R2_ACCESS_KEY_ID,
    CLOUD_FLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUD_FLARE_R2_SECRET_ACCESS_KEY,
    CLOUD_FLARE_R2_S3_ENDPOINT_URL: process.env.CLOUD_FLARE_R2_S3_ENDPOINT_URL || "https://lapwork-downloads.srivastavarishabh2001.workers.dev",

    // Upstash Redis
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    
    // GitHub
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
}
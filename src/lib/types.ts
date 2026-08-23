// Central type definitions for the entire application

export type Platform = "windows" | "macos";

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

export type AnalyticsStats = {
  activeVisitors: number;
  totalPageViews: number;
  totalDownloads: number;
  today: {
    date: string;
    pageViews: number;
    downloads: number;
  };
};

export type HeartbeatResponse = {
  activeVisitors: number;
  ttl: number;
  visitorId: string;
};

export type LatestRelease = {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: number;
  publishedAt: string;
};

export type ReleasesResponse = {
  windows: LatestRelease | null;
  macos: LatestRelease | null;
};
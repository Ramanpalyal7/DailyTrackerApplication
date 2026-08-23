// Client-side analytics tracker with production features
// This file should only be imported in client components ("use client")

"use client";

import type { AnalyticsStats, HeartbeatResponse } from "./types";

type AnalyticsConfig = {
  heartbeatInterval?: number;
  onActiveVisitorsUpdate?: (count: number) => void;
  onError?: (error: Error) => void;
  autoTrackPageView?: boolean;
};

const DEFAULT_CONFIG: Required<AnalyticsConfig> = {
  heartbeatInterval: 30000, // 30 seconds
  onActiveVisitorsUpdate: () => {},
  onError: () => {},
  autoTrackPageView: true,
};

const STORAGE_KEY = "lapwork_visitor_id";
const HEARTBEAT_ENDPOINT = "/api/analytics/heartbeat";
const PAGEVIEW_ENDPOINT = "/api/analytics/pageview";
const STATS_ENDPOINT = "/api/analytics/stats";

export class AnalyticsTracker {
  private visitorId: string;
  private config: Required<AnalyticsConfig>;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private currentPath: string = "/";
  private isActive: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(config: AnalyticsConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.visitorId = this.getOrCreateVisitorId();

    // Auto-track page view if enabled
    if (this.config.autoTrackPageView && typeof window !== "undefined") {
      this.trackPageView(window.location.pathname);
    }

    // Handle page visibility changes
    this.setupVisibilityHandler();
  }

  /**
   * Get or create a persistent visitor ID
   */
  private getOrCreateVisitorId(): string {
    if (typeof window === "undefined") {
      return this.generateFallbackId();
    }

    try {
      let visitorId = localStorage.getItem(STORAGE_KEY);

      if (!visitorId) {
        visitorId = this.generateVisitorId();
        localStorage.setItem(STORAGE_KEY, visitorId);
      }

      return visitorId;
    } catch (error) {
      // localStorage might be blocked (private mode, etc.)
      console.warn("localStorage not available, using session ID");
      return this.generateFallbackId();
    }
  }

  /**
   * Generate a unique visitor ID
   */
  private generateVisitorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `visitor_${timestamp}_${random}`;
  }

  /**
   * Fallback ID for when localStorage is unavailable
   */
  private generateFallbackId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Track a page view
   */
  async trackPageView(path: string): Promise<boolean> {
    this.currentPath = path;

    try {
      const response = await fetch(PAGEVIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          visitorId: this.visitorId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Page view tracking failed: ${response.status}`);
      }

      // Start heartbeat after successful page view
      this.startHeartbeat();
      this.retryCount = 0;
      return true;
    } catch (error) {
      this.handleError("trackPageView", error);
      return false;
    }
  }

  /**
   * Start sending heartbeats
   */
  private startHeartbeat(): void {
    if (this.isActive || typeof window === "undefined") {
      return;
    }

    this.isActive = true;
    
    // Send initial heartbeat
    this.sendHeartbeat();

    // Set up interval
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  /**
   * Send a single heartbeat
   */
  private async sendHeartbeat(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    try {
      const response = await fetch(HEARTBEAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: this.visitorId,
          path: this.currentPath,
        }),
      });

      if (!response.ok) {
        throw new Error(`Heartbeat failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        const heartbeatData = data.data as HeartbeatResponse;
        this.config.onActiveVisitorsUpdate(heartbeatData.activeVisitors);
        this.retryCount = 0;
      }
    } catch (error) {
      this.handleError("sendHeartbeat", error);
      
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.sendHeartbeat(), 5000);
      }
    }
  }

  /**
   * Stop sending heartbeats
   */
  stopHeartbeat(): void {
    this.isActive = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Get current visitor ID
   */
  getVisitorId(): string {
    return this.visitorId;
  }

  /**
   * Fetch current analytics stats
   */
  async getStats(): Promise<{ success: boolean; data?: AnalyticsStats; error?: string }> {
    try {
      const response = await fetch(STATS_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`Stats fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError("getStats", error);
      return { success: false, error: "Failed to fetch stats" };
    }
  }

  /**
   * Handle page visibility changes
   */
  private setupVisibilityHandler(): void {
    if (typeof document === "undefined") {
      return;
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page hidden, slow down heartbeats
        this.stopHeartbeat();
      } else {
        // Page visible again, resume heartbeats
        this.startHeartbeat();
      }
    });
  }

  /**
   * Handle errors consistently
   */
  private handleError(context: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Analytics error in ${context}:`, errorMessage);
    this.config.onError(new Error(errorMessage));
  }
}

// Export a singleton instance
export const analyticsTracker = new AnalyticsTracker();
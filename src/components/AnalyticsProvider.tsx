"use client";

import { useEffect } from "react";
import { AnalyticsTracker } from "@/lib/analytics-tracker";

export const AnalyticsProvider = () => {
  useEffect(() => {
    // Create tracker instance
    const tracker = new AnalyticsTracker({
      heartbeatInterval: 30000,
      onActiveVisitorsUpdate: () => {},
      onError: (error) => {
        console.error("Analytics error:", error);
      },
      autoTrackPageView: false, // We'll track manually
    });

    // Track page view
    tracker.trackPageView(window.location.pathname);

    // Cleanup on unmount
    return () => {
      tracker.stopHeartbeat();
    };
  }, []);

  return null; // This component doesn't render anything
};
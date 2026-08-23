"use client";

import { useEffect, useState, useCallback } from "react";
import { AnalyticsTracker, analyticsTracker } from "@/lib/analytics-tracker";
import type { AnalyticsStats, LatestRelease } from "@/lib/types";
import { formatBytes } from "@/lib/utils";

export default function TestAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [release, setRelease] = useState<LatestRelease | null>(null);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [heartbeatStatus, setHeartbeatStatus] = useState("Waiting...");
  const [pageviewStatus, setPageviewStatus] = useState("Not tracked yet");
  const [downloadStatus, setDownloadStatus] = useState("Not clicked yet");
  const [visitorId, setVisitorId] = useState("");
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateStats = useCallback(async () => {
    try {
      const data = await analyticsTracker.getStats();
      if (data?.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to fetch statistics");
    }
  }, []);

  useEffect(() => {
    // Initialize tracker with visitor ID
    const tracker = new AnalyticsTracker({
      heartbeatInterval: 30000, // 30 seconds
      onActiveVisitorsUpdate: (count) => {
        setActiveVisitors(count);
        setHeartbeatStatus(`✅ Active - ${count} visitors online`);
        setHeartbeatCount((prev) => prev + 1);
      },
    });

    setVisitorId(tracker.getVisitorId());

    // Track initial page view
    tracker.trackPageView("/test-analytics").then(() => {
      setPageviewStatus("✅ Page view tracked successfully");
    });

    // Fetch initial stats
    updateStats();
    setLoading(false);

    // Fetch latest release
    fetch("/api/releases/latest")
      .then((res) => res.json())
      .then((data) => {
        if (data?.windows) {
          setRelease(data.windows);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch release:", err);
        setError("Failed to fetch latest release");
      });

    // Cleanup
    return () => {
      tracker.stopHeartbeat();
    };
  }, [updateStats]);

  const handleManualHeartbeat = async () => {
    setHeartbeatStatus("Sending heartbeat...");
    try {
      const response = await fetch("/api/analytics/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          path: "/test-analytics",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setActiveVisitors(data.data.activeVisitors);
        setHeartbeatStatus(
          `✅ Heartbeat sent - ${data.data.activeVisitors} active`,
        );
        setHeartbeatCount((prev) => prev + 1);
      }
    } catch (err) {
      setHeartbeatStatus("❌ Failed to send heartbeat");
      setError("Heartbeat failed");
    }
  };

  const handleTestDownload = () => {
    setDownloadStatus("Starting download...");

    // Use window.location.href to properly trigger the download
    // This will follow the redirect to Cloudflare Worker
    window.location.href = `/api/download?platform=windows&visitorId=${visitorId}`;

    // Update status after a short delay
    setTimeout(() => {
      setDownloadStatus("✅ Download started! Check your downloads folder.");
      // Refresh stats after download
      updateStats();
    }, 2000);
  };

  const handleRefreshStats = () => {
    updateStats();
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#1a1a1a",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        🧪 Analytics Test Page
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        This page tests all analytics endpoints and download functionality
      </p>

      {error && (
        <div
          style={{
            background: "#fee",
            border: "1px solid #fcc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Visitor Info Card */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>📋 Visitor Information</h2>
        <div style={infoRowStyle}>
          <span>Visitor ID:</span>
          <code style={codeStyle}>{visitorId}</code>
        </div>
        <div style={infoRowStyle}>
          <span>Heartbeat Count:</span>
          <span>{heartbeatCount}</span>
        </div>
        <div style={infoRowStyle}>
          <span>Status:</span>
          <span>{heartbeatStatus}</span>
        </div>
      </div>

      {/* Live Stats Card */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>📊 Live Analytics</h2>
        {loading ? (
          <p>Loading stats...</p>
        ) : stats ? (
          <div>
            <div style={statGridStyle}>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{stats.activeVisitors}</div>
                <div style={statLabelStyle}>Active Visitors</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{stats.totalPageViews}</div>
                <div style={statLabelStyle}>Total Page Views</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{stats.totalDownloads}</div>
                <div style={statLabelStyle}>Total Downloads</div>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Today's Stats
              </h3>
              <div style={infoRowStyle}>
                <span>Date:</span>
                <span>{stats.today.date}</span>
              </div>
              <div style={infoRowStyle}>
                <span>Page Views:</span>
                <span>{stats.today.pageViews}</span>
              </div>
              <div style={infoRowStyle}>
                <span>Downloads:</span>
                <span>{stats.today.downloads}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>No stats available</p>
        )}
        <button onClick={handleRefreshStats} style={buttonStyle}>
          🔄 Refresh Stats
        </button>
      </div>

      {/* Test Actions Card */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>🎯 Test Actions</h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "10px" }}>
            Page View Tracking
          </h3>
          <p style={{ marginBottom: "10px" }}>{pageviewStatus}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "10px" }}>Heartbeat</h3>
          <p style={{ marginBottom: "10px" }}>{heartbeatStatus}</p>
          <button onClick={handleManualHeartbeat} style={buttonStyle}>
            💓 Send Manual Heartbeat
          </button>
        </div>

        <div>
          <h3 style={{ fontWeight: "600", marginBottom: "10px" }}>
            Download Tracking
          </h3>
          {release && (
            <div
              style={{
                background: "#f5f5f5",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Version:</strong> {release.version}
              </p>
              <p>
                <strong>File:</strong> {release.fileName}
              </p>
              <p>
                <strong>Size:</strong> {formatBytes(release.size)}
              </p>
            </div>
          )}
          <p style={{ marginBottom: "10px" }}>{downloadStatus}</p>
          <button
            onClick={handleTestDownload}
            style={{ ...buttonStyle, background: "#0052cc" }}
            disabled={!release}
          >
            ⬇️ Test Download (Windows)
          </button>
        </div>
      </div>

      {/* API Endpoints Info */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>🔌 API Endpoints Being Tested</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={endpointStyle}>
            <code>POST /api/analytics/pageview</code>
            <span style={statusBadgeStyle}>✅ Active</span>
          </li>
          <li style={endpointStyle}>
            <code>POST /api/analytics/heartbeat</code>
            <span style={statusBadgeStyle}>✅ Active</span>
          </li>
          <li style={endpointStyle}>
            <code>GET /api/analytics/stats</code>
            <span style={statusBadgeStyle}>✅ Active</span>
          </li>
          <li style={endpointStyle}>
            <code>GET /api/releases/latest</code>
            <span style={statusBadgeStyle}>✅ Active</span>
          </li>
          <li style={endpointStyle}>
            <code>GET /api/download</code>
            <span style={statusBadgeStyle}>✅ Active</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Styles
const cardStyle = {
  background: "white",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "16px",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #f0f0f0",
};

const codeStyle = {
  background: "#f5f5f5",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

const statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const statCardStyle = {
  background: "#f8f9fa",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const statValueStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#0052cc",
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#666",
  marginTop: "8px",
};

const buttonStyle = {
  background: "#0052cc",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "10px",
};

const endpointStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #f0f0f0",
};

const statusBadgeStyle = {
  background: "#e8f5e9",
  color: "#2e7d32",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

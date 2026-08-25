export const trackDownload = async (platform: string = "windows") => {
  try {
    const visitorId = localStorage.getItem("lapwork_visitor_id") || "anonymous";
    
    // This will track and redirect to download
    window.location.href = `/api/download?platform=${platform}&visitorId=${visitorId}`;
    
    return { success: true };
  } catch (error) {
    console.error("Failed to track download: ", error);
    return { success: false };
  }
};

export const getStats = async () => {
  try {
    const response = await fetch("/api/analytics/stats", {
      method: "GET",
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(" Failed to fetch stats ", error);
    return null;
  }
}
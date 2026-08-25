"use client";
import { useState, useEffect, useCallback } from "react";
import { getStats } from "@/lib/api";
import { motion, AnimatePresence } from "motion/react";

interface StatsData {
  totalDownloads: number;
  totalPageViews: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getStats();
      if (response?.success) {
        setStats({
          totalDownloads: response.data.totalDownloads,
          totalPageViews: response.data.totalPageViews,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <section className="py-16 bg-white">
      <div className="flex flex-row justify-around gap-10 m-auto items-center">
        <div className="flex flex-col justify-start items-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={stats?.totalDownloads ?? "loading"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="footer-text"
            >
              {loading ? "..." : stats?.totalDownloads ?? "0"}
            </motion.p>
          </AnimatePresence>
          <h3 className="bg-gradient-to-b from-gray-300 to-gray-700 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-[12px] md:text-[16px] lg:text-[18px]">
            Downloads
          </h3>
        </div>
        <div className="flex flex-col justify-center items-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={stats?.totalPageViews ?? "loading"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="footer-text"
            >
              {loading ? "..." : stats?.totalPageViews ?? "0"}
            </motion.p>
          </AnimatePresence>
          <h3 className="bg-gradient-to-b from-gray-300 to-gray-700 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-[12px] md:text-[16px] lg:text-[18px]">
            Total Page Views
          </h3>
        </div>
      </div>
    </section>
  );
};
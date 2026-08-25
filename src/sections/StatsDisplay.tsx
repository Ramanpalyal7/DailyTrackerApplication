"use client";
import { useState, useEffect } from "react";
import { getStats } from "@/lib/api";

interface StatsData {
  totalDownloads: number;
  totalPageViews: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);

useEffect(() => {
    const fetchStats = async () => {
      const response = await getStats();
      if (response?.success) {
        setStats({
          totalDownloads: response.data.totalDownloads,
          totalPageViews: response.data.totalPageViews,
        });
      }
    };

    fetchStats();
  }, []);


  return (
    <section className="py-16 bg-white">
      <div className=" flex flex-row justify-around gap-10 m-auto items-center">
        <div className=" flex flex-col justify-start items-center">
          <p className="footer-text animate-pulse">{stats?.totalDownloads ?? "..."}</p>
          <h3 className=" bg-gradient-to-b from-gray-300 to-gray-700 
      bg-clip-text text-xl font-bold tracking-tight text-transparent
      sm:text-[12px]
      md:text-[16px]
      lg:text-[18px]
      ">
            Downloads
          </h3>
         
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="footer-text  animate-pulse">{stats?.totalPageViews ?? "..."}</p>
          <h3 className="bg-gradient-to-b from-gray-300 to-gray-700 
      bg-clip-text text-xl font-bold tracking-tight text-transparent
      sm:text-[12px]
      md:text-[16px]
      lg:text-[18px]">Total Page Views</h3>
        </div>
      </div>
    </section>
  );
};

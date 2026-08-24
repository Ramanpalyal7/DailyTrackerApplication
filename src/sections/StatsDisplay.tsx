"use client";
import { useState, useEffect } from "react";
import { getStats } from "@/lib/api";

interface StatsData {
  downloads: number;
  totalVisitors: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className=" flex flex-row justify-around gap-10 m-auto items-center">
        <div className=" flex flex-col justify-start items-center">
          <p className="footer-text animate-pulse">{stats?.downloads ?? "50"}</p>
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
          <p className="footer-text  animate-pulse">{stats?.totalVisitors ?? "300"}</p>
          <h3 className="bg-gradient-to-b from-gray-300 to-gray-700 
      bg-clip-text text-xl font-bold tracking-tight text-transparent
      sm:text-[12px]
      md:text-[16px]
      lg:text-[18px]">Total Visitors</h3>
        </div>
      </div>
    </section>
  );
};

"use client";

import React, { useMemo } from "react";
import { DisplayMode, ReportCardProps } from "@/components/reportcard/datatypes";

interface StatsOverviewProps {
  reportCards: ReportCardProps[];
  displayMode: DisplayMode;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ reportCards, displayMode }) => {
  const stats = useMemo(() => {
    const getAverage = (card: ReportCardProps) => {
      if (displayMode === "annual") return parseFloat(card.annualAverage?.toString() || "0");
      if (displayMode === "first-term") return parseFloat(card.firstTermAvg?.toString() || "0");
      if (displayMode === "second-term") return parseFloat(card.secondTermAvg?.toString() || "0");
      if (displayMode === "third-term") return parseFloat(card.thirdTermAvg?.toString() || "0");

      // For sequences (s1–s6)
      if (displayMode.startsWith("s")) {
        const scores =
          card.subjects
            ?.map((s) => s[displayMode])
            .filter((score): score is number => typeof score === "number") ?? [];
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      }

      return 0;
    };

    const averages = reportCards
      .map((card) => getAverage(card))
      .filter((avg) => !isNaN(avg) && avg > 0);

    const classAvg = averages.length
      ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2)
      : "0";
    const highestAvg = averages.length ? Math.max(...averages).toFixed(2) : "0";
    const lowestAvg = averages.length ? Math.min(...averages).toFixed(2) : "0";

    const passing = averages.filter((avg) => avg >= 10).length;
    const passingRate =
      averages.length > 0 ? ((passing / averages.length) * 100).toFixed(1) : "0";

    return {
      totalStudents: reportCards.length,
      classAvg,
      highestAvg,
      lowestAvg,
      passing,
      passingRate,
    };
  }, [reportCards, displayMode]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
        <p className="text-sm text-gray-600 font-medium">Total Students</p>
        <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
        <p className="text-sm text-gray-600 font-medium">Class Average</p>
        <p className="text-2xl font-bold text-green-600">{stats.classAvg}/20</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
        <p className="text-sm text-gray-600 font-medium">Highest Score</p>
        <p className="text-2xl font-bold text-purple-600">{stats.highestAvg}/20</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
        <p className="text-sm text-gray-600 font-medium">Lowest Score</p>
        <p className="text-2xl font-bold text-orange-600">{stats.lowestAvg}/20</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500">
        <p className="text-sm text-gray-600 font-medium">Passing</p>
        <p className="text-2xl font-bold text-emerald-600">{stats.passing}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
        <p className="text-sm text-gray-600 font-medium">Pass Rate</p>
        <p className="text-2xl font-bold text-indigo-600">{stats.passingRate}%</p>
      </div>
    </div>
  );
};

export default StatsOverview;

"use client";

import React from "react";

interface Statistics {
  total: number;
  passing: number;
  failing: number;
  passPercentage: number;
  failPercentage: number;
}

interface PerformanceAnalyticsProps {
  statistics: Statistics;
  displayMode: string;
  passingGrade: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  statistics,
  displayMode,
  passingGrade,
}) => {
  // Map displayMode to a friendly label
  const displayLabel =
    displayMode === "annual"
      ? "Annual Report"
      : displayMode === "first-term"
      ? "First Term"
      : displayMode === "second-term"
      ? "Second Term"
      : displayMode === "third-term"
      ? "Third Term"
      : displayMode.toUpperCase().replace("S", "Sequence ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Performance Analytics
            </h3>
            <span className="text-indigo-100 text-sm font-medium">
              {displayLabel}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Students */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-700">
                  Total Students
                </span>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-900">
                {statistics.total}
              </div>
            </div>

            {/* Passing */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700">
                  Passing (≥{passingGrade})
                </span>
                <div className="p-2 bg-emerald-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-emerald-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-emerald-900">
                  {statistics.passing}
                </div>
                <div className="text-lg font-semibold text-emerald-600 mb-1">
                  ({statistics.passPercentage.toFixed(1)}%)
                </div>
              </div>
              <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                  style={{ width: `${statistics.passPercentage}%` }}
                />
              </div>
            </div>

            {/* Failing */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-6 border-2 border-rose-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-rose-700">
                  Failing (&lt;{passingGrade})
                </span>
                <div className="p-2 bg-rose-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-rose-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-rose-900">
                  {statistics.failing}
                </div>
                <div className="text-lg font-semibold text-rose-600 mb-1">
                  ({statistics.failPercentage.toFixed(1)}%)
                </div>
              </div>
              <div className="mt-3 h-2 bg-rose-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-500"
                  style={{ width: `${statistics.failPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Performance Distribution
              </span>
            </div>
            <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                style={{ width: `${statistics.passPercentage}%` }}
              >
                {statistics.passPercentage > 15 &&
                  `${statistics.passPercentage.toFixed(0)}%`}
              </div>
              <div
                className="bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                style={{ width: `${statistics.failPercentage}%` }}
              >
                {statistics.failPercentage > 15 &&
                  `${statistics.failPercentage.toFixed(0)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;

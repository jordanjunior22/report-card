// components/reportcard/Header.tsx
import React from "react";
import { DisplayMode } from "./datatypes";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  viewMode: "grid" | "list" | "cards";
  setViewMode: (value: "grid" | "list" | "cards") => void;
  displayMode: DisplayMode;
  setDisplayMode: (value: DisplayMode) => void;
  academicYear: string;
  setAcademicYear: (value: string) => void;
  onOpenSettings: () => void;
  cardIds: string[];
  onDownloadAll: () => void;
  totalCards: number;
  filteredCards: number;
};

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  displayMode,
  setDisplayMode,
  academicYear,
  setAcademicYear,
  onOpenSettings,
  cardIds,
  onDownloadAll,
  totalCards,
  filteredCards,
}) => {
  const viewIcons = {
    grid: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    list: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    cards: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <header className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">Report Card Manager</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and download student report cards</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSettings}
              className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
            >
              Settings
            </button>

            <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
              {(["grid", "list", "cards"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode ? "bg-white text-indigo-600 shadow-md" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {viewIcons[mode]}
                </button>
              ))}
            </div>

            <button
              onClick={onDownloadAll}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Download All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] pl-3 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="annual">Annual Report</option>
            <option value="first-term">First Term</option>
            <option value="second-term">Second Term</option>
            <option value="third-term">Third Term</option>
            <option value="s1">Sequence 1</option>
            <option value="s2">Sequence 2</option>
            <option value="s3">Sequence 3</option>
            <option value="s4">Sequence 4</option>
            <option value="s5">Sequence 5</option>
            <option value="s6">Sequence 6</option>
          </select>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <span className="text-sm font-medium text-gray-600">{filteredCards} / {totalCards} students</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

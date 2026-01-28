"use client";

import React from "react";
import { DisplayMode, ReportCardProps } from "@/components/reportcard/datatypes";
export interface ReportCardViewProps {
  reportCards: ReportCardProps[];
  displayMode: DisplayMode;
  onDownload: (id: string, studentName: string) => void;
}


const getDisplayAverage = (card: any, displayMode: DisplayMode) => {
  if (displayMode === "annual") return card.annualAverage;
  if (displayMode === "first-term") return card.firstTermAvg;
  if (displayMode === "second-term") return card.secondTermAvg;
  if (displayMode === "third-term") return card.thirdTermAvg;

  if (displayMode.startsWith("s")) {
    const scores =
      card.subjects?.map((s: any) => s[displayMode]).filter((n: any) => typeof n === "number") ?? [];
    return scores.length ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : "-";
  }

  return "-";
};

const getDisplayPosition = (
  displayMode: DisplayMode,
  position?: string,
  sequencePosition?: number
) => {
  if (displayMode === "annual") return position ?? "-";

  if (
    displayMode === "first-term" ||
    displayMode === "second-term" ||
    displayMode === "third-term"
  ) {
    return position ? `#${position}` : "-";
  }

  if (displayMode.startsWith("s")) {
    return typeof sequencePosition === "number" ? `#${sequencePosition}` : "-";
  }

  return "-";
};

const GridView: React.FC<ReportCardViewProps> = ({
  reportCards,
  displayMode,
  onDownload,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {reportCards.map((card, index) => {
        const avg = getDisplayAverage(card, displayMode);
        const position = getDisplayPosition(displayMode, card.position, card.sequencePosition);

        return (
          <div
            key={card.matricule ?? index}
            className="bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <h3 className="font-bold text-sm truncate">{card.studentName}</h3>
              <p className="text-xs">{card.matricule}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span>Average</span>
                <span className="font-bold">{avg !== "-" ? `${avg}/20` : "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>Position</span>
                <span className="font-bold">{position}</span>
              </div>

              <button
                onClick={() => onDownload(`report-card-${index}`, card.studentName)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Download
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;

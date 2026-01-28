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
  if (displayMode.startsWith("s")) return sequencePosition ? `#${sequencePosition}` : "-";
  return position ? `#${position}` : "-";
};

const ListView: React.FC<ReportCardViewProps> = ({
  reportCards,
  displayMode,
  onDownload,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">Student</th>
            <th className="p-4 text-center">Average</th>
            <th className="p-4 text-center">Position</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {reportCards.map((card, index) => {
            const avg = getDisplayAverage(card, displayMode);
            const position = getDisplayPosition(displayMode, card.position, card.sequencePosition);

            return (
              <tr key={card.matricule ?? index} className="border-t">
                <td className="p-4">{card.studentName}</td>
                <td className="p-4 text-center">{avg !== "-" ? `${avg}/20` : "-"}</td>
                <td className="p-4 text-center">{position}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onDownload(`report-card-${index}`, card.studentName)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Download
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;

"use client";

import React, { useState } from "react";
import transformReportCardData from "@/components/reportcard/transformReportCardData";
import { Subject, ReportCardProps, DisplayMode } from "@/components/reportcard/datatypes";
import { mockAPIResponse } from "@/components/reportcard/mockAPResponse";
import ReportCartTemplateA from "@/components/reportcard/templates/ReportCartTemplateA";

// ===============================
// PRINT FUNCTION (Single Student)
// ===============================
const printReportCards = (cardIds: string[]) => {
  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Report Card</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: A4; margin: 0; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
  `;

  cardIds.forEach((id, index) => {
    const card = document.getElementById(id);
    if (card) {
      htmlContent += card.outerHTML;
      if (index < cardIds.length - 1) htmlContent += '<div class="page-break"></div>';
    }
  });

  htmlContent += `
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 1000);
};

// ===============================
// MAIN APP COMPONENT
// ===============================
export default function App() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("annual");

  // Transform API data to report card props
  const reportCardProps = transformReportCardData(mockAPIResponse, displayMode);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* CONTROL PANEL */}
      <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-20 text-sm flex flex-col gap-2">
        <div>
          <label className="block font-semibold mb-2">Display Mode:</label>
          <select
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            className="border px-3 py-1 rounded"
          >
            <option value="annual">Annual</option>
            <option value="first-term">1st Term</option>
            <option value="second-term">2nd Term</option>
            <option value="third-term">3rd Term</option>
            <option value="s1">Sequence 1</option>
            <option value="s2">Sequence 2</option>
            <option value="s3">Sequence 3</option>
            <option value="s4">Sequence 4</option>
            <option value="s5">Sequence 5</option>
            <option value="s6">Sequence 6</option>
          </select>
        </div>

        <button
          onClick={() => printReportCards(["report-card"])}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* REPORT CARD */}
      <div className="flex justify-center py-8">
        <ReportCartTemplateA {...reportCardProps} cardId="report-card" />
      </div>
    </div>
  );
}

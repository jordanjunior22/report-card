"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DisplayMode } from "@/components/reportcard/datatypes";
import { transformMultipleReportCards } from "@/components/reportcard/transformMultipleReportCardData";
import { mockAPIResponseMultiple } from "@/components/reportcard/mockAPIResponseMultiple";
import Header from "@/components/reportcard/Header";
import SettingsModal from "@/components/reportcard/SettingsModal";
import PerformanceAnalytics from "@/components/reportcard/PerformanceAnalytics";
import GridView from "@/components/reportcard/views/GridView";
import ListView from "@/components/reportcard/views/ListView";
import StatsOverview from "@/components/reportcard/views/StatsOverview";
import { saveReportCardSettings } from "@/components/reportcard/helpers/settingsStorage";
import { loadReportCardSettings } from "@/components/reportcard/helpers/settingsStorage";
import { DEFAULT_SETTINGS } from "@/components/reportcard/helpers/settingsStorage";
// Import all templates
import ReportCartTemplateA from "@/components/reportcard/templates/ReportCartTemplateA";
import ReportCartTemplateB from "@/components/reportcard/templates/ReportCartTemplateB";
import ReportCartTemplateC from "@/components/reportcard/templates/ReportCartTemplateC";

// Map template names to components
const templates = {
  TemplateA: ReportCartTemplateA,
  TemplateB: ReportCartTemplateB,
  TemplateC: ReportCartTemplateC,
} as const;

type TemplateKey = keyof typeof templates;
type ViewMode = "grid" | "list" | "cards";

// ===============================
// PRINT FUNCTION
// ===============================
const printReportCards = (cardIds: string[]) => {
  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Report Cards</title>
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
        ${cardIds
      .map((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return "";
        return el.outerHTML + (idx < cardIds.length - 1 ? '<div class="page-break"></div>' : "");
      })
      .join("")}
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

const downloadSingleCard = (cardId: string, studentName: string) => {
  const element = document.getElementById(cardId);
  if (!element) return;

  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${studentName} - Report Card</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: A4; margin: 0; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// ===============================
// MAIN PAGE
// ===============================
export default function PrintMultipleReportCardsPage() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("annual");
  const [templateName, setTemplateName] = useState<TemplateKey>("TemplateA");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [classMaster, setClassMaster] = useState("");
  const [passingGrade, setPassingGrade] = useState(10);
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const schoolId = "school-001"; // later from auth
  const classId = "class-3A";    // later from route

  // useEffect(() => {
  //   if (isSettingsOpen) return;

  //   const loadSettings = async () => {
  //     try {
  //       const saved = await loadReportCardSettings(
  //         schoolId,
  //         classId,
  //         displayMode,
  //         academicYear
  //       );

  //       if (saved) {
  //         setTemplateName(saved.settings.templateName);
  //         setPassingGrade(saved.settings.passingGrade);
  //         setClassMaster(saved.settings.classMaster);
  //       } else {
  //         setTemplateName(DEFAULT_SETTINGS.templateName);
  //         setPassingGrade(DEFAULT_SETTINGS.passingGrade);
  //         setClassMaster(DEFAULT_SETTINGS.classMaster);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load settings", error);

  //       // fallback to defaults on error
  //       setTemplateName(DEFAULT_SETTINGS.templateName);
  //       setPassingGrade(DEFAULT_SETTINGS.passingGrade);
  //       setClassMaster(DEFAULT_SETTINGS.classMaster);
  //     }
  //   };

  //   loadSettings();
  // }, [schoolId, classId, displayMode, academicYear, isSettingsOpen]);

  useEffect(() => {
    if (isSettingsOpen) return;

    const saved = loadReportCardSettings(
      schoolId,
      classId,
      displayMode,
      academicYear
    );

    if (saved) {
      setTemplateName(saved.settings.templateName);
      setPassingGrade(saved.settings.passingGrade);
      setClassMaster(saved.settings.classMaster);
    } else {
      setTemplateName(DEFAULT_SETTINGS.templateName);
      setPassingGrade(DEFAULT_SETTINGS.passingGrade);
      setClassMaster(DEFAULT_SETTINGS.classMaster);
    }
  }, [schoolId, classId, displayMode, academicYear, isSettingsOpen]);



  const reportCardSettingsPayload = useMemo(() => ({
    schoolId,
    classId,
    displayMode,
    academicYear,
    settings: {
      templateName,
      passingGrade,
      classMaster,
    },
    updatedAt: new Date().toISOString(),
  }), [
    schoolId,
    classId,
    displayMode,
    academicYear,
    templateName,
    passingGrade,
    classMaster,
  ]);
  
//API TO CALL REPORT BY (CLASS ID AND ACADEMIC YEAR + ANNUAL SUMMARY) FROM THE BACKEND

  const reportCards = useMemo(
    () => transformMultipleReportCards(mockAPIResponseMultiple, displayMode, classMaster || undefined),
    [displayMode, classMaster]
  );
  // Calculate pass/fail statistics
  const statistics = useMemo(() => {
    const passing = reportCards.filter((card) => {
      // Get the appropriate average based on display mode
      let avg = 0;

      if (displayMode === 'annual') {
        avg = card.annualAverage ?? 0;
      } else if (displayMode === 'first-term') {
        avg = card.firstTermAvg ?? 0;
      } else if (displayMode === 'second-term') {
        avg = card.secondTermAvg ?? 0;
      } else if (displayMode === 'third-term') {
        avg = card.thirdTermAvg ?? 0;
      } else {
        // For sequence modes (s1-s6), calculate from subjects
        const totalWeightedMarks = card.subjects.reduce((sum, subject) => {
          const mark = displayMode === 's1' ? subject.s1 :
            displayMode === 's2' ? subject.s2 :
              displayMode === 's3' ? subject.s3 :
                displayMode === 's4' ? subject.s4 :
                  displayMode === 's5' ? subject.s5 :
                    displayMode === 's6' ? subject.s6 : 0;
          return sum + (mark ?? 0) * subject.coefficient;
        }, 0);

        const totalCoefficients = card.subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
        avg = totalCoefficients > 0 ? totalWeightedMarks / totalCoefficients : 0;
      }

      return avg >= passingGrade;
    }).length;

    const failing = reportCards.length - passing;
    const passPercentage = reportCards.length > 0 ? (passing / reportCards.length) * 100 : 0;
    const failPercentage = reportCards.length > 0 ? (failing / reportCards.length) * 100 : 0;

    return { passing, failing, passPercentage, failPercentage, total: reportCards.length };
  }, [reportCards, passingGrade, displayMode]);

  // Filter report cards by search query
  const filteredReportCards = useMemo(() => {
    if (!searchQuery.trim()) return reportCards;
    const query = searchQuery.toLowerCase();
    return reportCards.filter((card) =>
      card.studentName?.toLowerCase().includes(query) ||
      card.matricule?.toLowerCase().includes(query)
    );
  }, [reportCards, searchQuery]);

  const cardIds = filteredReportCards.map((_, index) => `report-card-${index}`);
  const SelectedTemplate = templates[templateName];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* MODERN HEADER */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        academicYear={academicYear}
        setAcademicYear={setAcademicYear}
        onOpenSettings={() => setIsSettingsOpen(true)}
        cardIds={cardIds}
        onDownloadAll={() => printReportCards(cardIds)}
        totalCards={reportCards.length}
        filteredCards={filteredReportCards.length}
      />


      {/* PASS/FAIL ANALYTICS BANNER */}
      <PerformanceAnalytics
        statistics={statistics}
        displayMode={displayMode}
        passingGrade={passingGrade}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 pb-8 space-y-6">
        {/* Stats Overview for Grid/List views */}
        {(viewMode === "grid" || viewMode === "list") && (
          <StatsOverview reportCards={filteredReportCards} displayMode={displayMode} />
        )}

        {/* Content Based on View Mode */}
        {viewMode === "grid" && (
          <GridView reportCards={filteredReportCards} displayMode={displayMode} onDownload={downloadSingleCard} />
        )}

        {viewMode === "list" && (
          <ListView reportCards={filteredReportCards} displayMode={displayMode} onDownload={downloadSingleCard} />
        )}

        {viewMode === "cards" && (
          <div className="flex flex-col items-center gap-8">
            {filteredReportCards.map((props, index) => (
              <div key={props.matricule ?? index} className="w-full flex justify-center">
                <SelectedTemplate {...props} cardId={`report-card-${index}`} />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredReportCards.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      {/* Hidden Report Cards for Printing */}
      {(viewMode === "grid" || viewMode === "list") && (
        <div className="hidden">
          {filteredReportCards.map((props, index) => (
            <SelectedTemplate key={props.matricule ?? index} {...props} cardId={`report-card-${index}`} />
          ))}
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        passingGrade={passingGrade}
        setPassingGrade={setPassingGrade}
        classMaster={classMaster}
        setClassMaster={setClassMaster}
        templateName={templateName}
        setTemplateName={setTemplateName}
        onSave={() => {
          saveReportCardSettings(reportCardSettingsPayload);
        }}
        // onSave={async () => {
        //   await saveReportCardSettings(reportCardSettingsPayload);
        // }}
      />

    </div>
  );
}
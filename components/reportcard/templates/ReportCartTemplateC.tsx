"use client";

import React from "react";
import { Subject, ReportCardProps } from "@/components/reportcard/datatypes";

const ReportCardTemplateC: React.FC<ReportCardProps> = ({
  schoolName,
  schoolLogo,
  schoolTel,
  schoolMotto,
  studentName,
  matricule,
  dateOfBirth,
  placeOfBirth,
  className,
  classMaster,
  academicYear,
  passportPhoto,
  subjects,
  displayMode,
  annualAverage,
  position,
  sequencePosition,
  firstTermAvg,
  secondTermAvg,
  thirdTermAvg,
  classAverage,
  councilDecision,
  absences,
  lateness,
  behavior,
  disciplineRemarks,
  principalName,
  cardId = "report-card-b",
}) => {

  const getReportTitle = () => {
    if (displayMode === "annual") return "ANNUAL REPORT CARD";
    if (displayMode === "first-term") return "FIRST TERM REPORT CARD";
    if (displayMode === "second-term") return "SECOND TERM REPORT CARD";
    if (displayMode === "third-term") return "THIRD TERM REPORT CARD";
    if (displayMode.startsWith("s"))
      return `SEQUENCE ${displayMode.toUpperCase()} REPORT CARD`;
    return "REPORT CARD";
  };

  /* ---------- helpers (UNCHANGED LOGIC) ---------- */

  const calculateSubjectAverage = (subject: Subject) => {
    const scores: number[] = [];

    if (displayMode === "annual") {
      ["s1", "s2", "s3", "s4", "s5", "s6"].forEach((k) => {
        const v = subject[k as keyof Subject];
        if (typeof v === "number") scores.push(v);
      });
    } else if (displayMode === "first-term") {
      ["s1", "s2"].forEach((k) => {
        const v = subject[k as keyof Subject];
        if (typeof v === "number") scores.push(v);
      });
    } else if (displayMode === "second-term") {
      ["s3", "s4"].forEach((k) => {
        const v = subject[k as keyof Subject];
        if (typeof v === "number") scores.push(v);
      });
    } else if (displayMode === "third-term") {
      ["s5", "s6"].forEach((k) => {
        const v = subject[k as keyof Subject];
        if (typeof v === "number") scores.push(v);
      });
    } else {
      const v = subject[displayMode as keyof Subject];
      if (typeof v === "number") scores.push(v);
    }

    return scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : "-";
  };

  const calculateWeightedAvg = (s: Subject) => {
    const avg = parseFloat(calculateSubjectAverage(s));
    return isNaN(avg) ? "-" : (avg * s.coefficient).toFixed(1);
  };

  const getDisplayAverage = () => {
    if (displayMode === "annual") return annualAverage ?? "-";
    if (displayMode === "first-term") return firstTermAvg ?? "-";
    if (displayMode === "second-term") return secondTermAvg ?? "-";
    if (displayMode === "third-term") return thirdTermAvg ?? "-";
    // Sequence mode: s1 to s6
    if (displayMode.startsWith("s")) {
      const seqAvg = subjects.reduce((sum, sub) => {
        const val = sub[displayMode as keyof typeof sub];
        return sum + (typeof val === "number" ? val : 0);
      }, 0);
      const count = subjects.reduce((cnt, sub) => (typeof sub[displayMode as keyof typeof sub] === "number" ? cnt + 1 : cnt), 0);
      return count ? (seqAvg / count).toFixed(1) : "-";
    }
    return "-";
  };

  const getDisplayPosition = () => {
    if (displayMode === "annual") return position ?? "-";

    if (
      displayMode === "first-term" ||
      displayMode === "second-term" ||
      displayMode === "third-term"
    ) {
      return position ? `#${position}` : "-";
    }

    if (displayMode.startsWith("s")) {
      return typeof sequencePosition === "number"
        ? `#${sequencePosition}`
        : "-";
    }

    return "-";
  };


  const sequencesToShow = () => {
    if (displayMode === "annual") return ["s1", "s2", "s3", "s4", "s5", "s6"];
    if (displayMode === "first-term") return ["s1", "s2"];
    if (displayMode === "second-term") return ["s3", "s4"];
    if (displayMode === "third-term") return ["s5", "s6"];
    return [displayMode];
  };

  const seqs = sequencesToShow();

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div
        id={cardId}
        className="w-[794px] min-h-[1123px] bg-white border-2 border-blue-200 shadow-2xl text-[9px] p-8 rounded-lg"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b-2 border-blue-300 pb-3">
          <div className="text-[10px] uppercase text-blue-900">
            <p className="font-semibold">Republic of Cameroon</p>
            <p className="italic normal-case text-blue-700">Peace – Work – Fatherland</p>
            <p className="font-semibold">Ministry of Secondary Education</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-300">
              <img src={schoolLogo} className="w-14 h-14 object-contain" />
            </div>
            <h1 className="text-[13px] font-bold uppercase text-blue-900">{schoolName}</h1>
            <p className="italic text-blue-700">{schoolMotto}</p>
            <p className="text-blue-800">Tel: {schoolTel}</p>
          </div>

          <div className="text-[10px] uppercase text-right text-blue-900">
            <p className="font-semibold">République du Cameroun</p>
            <p className="italic normal-case text-blue-700">Paix – Travail – Patrie</p>
            <p className="font-semibold">Ministère de l'Enseignement Secondaire</p>
          </div>
        </div>
        <div className="mt-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg shadow-md">
          <h2 className="text-[12px] font-bold uppercase">
            {getReportTitle()}
          </h2>
          <p className="text-[9px]">
            Academic Year: {academicYear}
          </p>
        </div>
        {/* MAIN BODY */}
        <div className="mt-4 flex gap-4">
          {/* LEFT PROFILE PANEL (UNIQUE FEATURE) */}
          <div className="w-44 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-2 rounded-lg shadow-md">
            <div className="w-full h-40 border-2 border-blue-300 mb-2 rounded-lg overflow-hidden bg-white shadow-sm">
              {passportPhoto && (
                <img
                  src={passportPhoto}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-1 text-blue-900">
              <p><b className="text-blue-700">Name:</b> {studentName}</p>
              <p><b className="text-blue-700">Matricule:</b> {matricule}</p>
              <p><b className="text-blue-700">DOB:</b> {dateOfBirth}</p>
              <p><b className="text-blue-700">POB:</b> {placeOfBirth}</p>
              <p><b className="text-blue-700">Class:</b> {className}</p>
              <p><b className="text-blue-700">Master:</b> {classMaster}</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            {/* PERFORMANCE STRIP */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 text-center rounded-lg shadow-md">
                <p className="font-semibold">Average</p>
                <p className="text-[18px] font-bold">{getDisplayAverage()}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-2 text-center rounded-lg shadow-md">
                <p className="font-semibold">Position</p>
                <p className="text-[18px] font-bold">{getDisplayPosition()}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-2 text-center rounded-lg shadow-md">
                <p className="font-semibold">Class Avg</p>
                <p className="text-[18px] font-bold">{classAverage ?? "-"}</p>
              </div>
            </div>

            {/* RESULTS TABLE */}
            <table className="w-full border-2 border-blue-200 border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="border border-blue-400 px-1 py-1">Subject</th>
                  {seqs.map((s) => (
                    <th key={s} className="border border-blue-400 px-1 py-1 uppercase">{s}</th>
                  ))}
                  <th className="border border-blue-400 px-1 py-1">Avg</th>
                  <th className="border border-blue-400 px-1 py-1">Coef</th>
                  <th className="border border-blue-400 px-1 py-1">Wt</th>
                  <th className="border border-blue-400 px-1 py-1">Remark</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i} className={i % 2 ? "bg-blue-50" : "bg-white"}>
                    <td className="border border-blue-200 px-1 font-medium text-blue-900">{s.name}</td>
                    {seqs.map((k) => (
                      <td key={k} className="border border-blue-200 px-1 text-center">
                        {s[k as keyof Subject] ?? "-"}
                      </td>
                    ))}
                    <td className="border border-blue-200 px-1 text-center font-semibold text-blue-700">
                      {calculateSubjectAverage(s)}
                    </td>
                    <td className="border border-blue-200 px-1 text-center">{s.coefficient}</td>
                    <td className="border border-blue-200 px-1 text-center font-medium text-indigo-700">
                      {calculateWeightedAvg(s)}
                    </td>
                    <td className="border border-blue-200 px-1 text-gray-700">{s.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER BAND */}
        <div className="mt-6 border-t-2 border-blue-300 pt-3 grid grid-cols-2 gap-4">
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* ACADEMIC SUMMARY */}
            <table className="w-full border-2 border-blue-200 border-collapse text-[9px] rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th colSpan={2} className="border border-blue-300 px-1 py-1 text-[10px] font-semibold">
                    Academic Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-blue-200 px-1 font-semibold text-blue-700">Average</td>
                  <td className="border border-blue-200 px-1 text-center font-bold text-blue-900">
                    {getDisplayAverage()}
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-blue-200 px-1 font-semibold text-blue-700">Position</td>
                  <td className="border border-blue-200 px-1 text-center font-bold text-blue-900">
                    {getDisplayPosition()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-blue-200 px-1 text-blue-700">Class Average</td>
                  <td className="border border-blue-200 px-1 text-center">
                    {classAverage ?? "-"}
                  </td>
                </tr>

                {displayMode === "annual" && (
                  <>
                    <tr className="bg-blue-50">
                      <td className="border border-blue-200 px-1 text-blue-700">1st Term Avg</td>
                      <td className="border border-blue-200 px-1 text-center">
                        {firstTermAvg ?? "-"}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-blue-200 px-1 text-blue-700">2nd Term Avg</td>
                      <td className="border border-blue-200 px-1 text-center">
                        {secondTermAvg ?? "-"}
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-blue-200 px-1 text-blue-700">3rd Term Avg</td>
                      <td className="border border-blue-200 px-1 text-center">
                        {thirdTermAvg ?? "-"}
                      </td>
                    </tr>
                  </>
                )}

                {councilDecision && (
                  <tr className="bg-white">
                    <td className="border border-blue-200 px-1 font-semibold text-blue-700">Council Decision</td>
                    <td className="border border-blue-200 px-1 text-center">
                      {councilDecision}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* DISCIPLINE SUMMARY */}
            <table className="w-full border-2 border-indigo-200 border-collapse text-[9px] rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <tr>
                  <th colSpan={2} className="border border-indigo-300 px-1 py-1 text-[10px] font-semibold">
                    Discipline Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-indigo-200 px-1 text-indigo-700">Absences</td>
                  <td className="border border-indigo-200 px-1 text-center">
                    {absences ?? "-"}
                  </td>
                </tr>
                <tr className="bg-indigo-50">
                  <td className="border border-indigo-200 px-1 text-indigo-700">Lateness</td>
                  <td className="border border-indigo-200 px-1 text-center">
                    {lateness ?? "-"}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-indigo-200 px-1 text-indigo-700">Behavior</td>
                  <td className="border border-indigo-200 px-1 text-center">
                    {behavior ?? "-"}
                  </td>
                </tr>
                <tr className="bg-indigo-50">
                  <td className="border border-indigo-200 px-1 text-indigo-700">Remarks</td>
                  <td className="border border-indigo-200 px-1 text-center">
                    {disciplineRemarks ?? "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="flex justify-between">
            <div className="text-center">
              <div className="border-b-2 border-blue-400 w-36 mb-1"></div>
              <p className="text-blue-900 font-medium">{classMaster}</p>
              <p className="italic text-blue-700">Class Master</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-blue-400 w-36 mb-1"></div>
              <p className="text-blue-900 font-medium">{principalName}</p>
              <p className="italic text-blue-700">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCardTemplateC;
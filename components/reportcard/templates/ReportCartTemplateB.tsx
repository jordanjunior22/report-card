"use client";

import React from "react";
import { Subject, ReportCardProps } from "@/components/reportcard/datatypes";

const ReportCardTemplateB: React.FC<ReportCardProps> = ({
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
    <div className="min-h-screen flex justify-center bg-gray-100 py-8">
      <div
        id={cardId}
        className="w-[794px] min-h-[1123px] bg-white border border-gray-300 shadow-xl text-[9px] p-8"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="text-[10px] uppercase">
            <p>Republic of Cameroon</p>
            <p className="italic normal-case">Peace – Work – Fatherland</p>
            <p>Ministry of Secondary Education</p>
          </div>

          <div className="text-center">
            <img src={schoolLogo} className="w-16 h-16 mx-auto" />
            <h1 className="text-[13px] font-bold uppercase">{schoolName}</h1>
            <p className="italic">{schoolMotto}</p>
            <p>Tel: {schoolTel}</p>
          </div>

          <div className="text-[10px] uppercase text-right">
            <p>République du Cameroun</p>
            <p className="italic normal-case">Paix – Travail – Patrie</p>
            <p>Ministère de l’Enseignement Secondaire</p>
          </div>
        </div>
        <div className="mt-3 text-center border border-gray-400 py-2">
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
          <div className="w-44 border border-gray-400 p-2">
            <div className="w-full h-40 border mb-2">
              {passportPhoto && (
                <img
                  src={passportPhoto}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p><b>Name:</b> {studentName}</p>
            <p><b>Matricule:</b> {matricule}</p>
            <p><b>DOB:</b> {dateOfBirth}</p>
            <p><b>POB:</b> {placeOfBirth}</p>
            <p><b>Class:</b> {className}</p>
            <p><b>Master:</b> {classMaster}</p>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            {/* PERFORMANCE STRIP */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="border p-2 text-center">
                <p className="font-semibold">Average</p>
                <p className="text-[18px] font-bold">{getDisplayAverage()}</p>
              </div>
              <div className="border p-2 text-center">
                <p className="font-semibold">Position</p>
                <p className="text-[18px] font-bold">{getDisplayPosition()}</p>
              </div>
              <div className="border p-2 text-center">
                <p className="font-semibold">Class Avg</p>
                <p className="text-[18px] font-bold">{classAverage ?? "-"}</p>
              </div>
            </div>

            {/* RESULTS TABLE */}
            <table className="w-full border border-gray-400 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-1">Subject</th>
                  {seqs.map((s) => (
                    <th key={s} className="border px-1 uppercase">{s}</th>
                  ))}
                  <th className="border px-1">Avg</th>
                  <th className="border px-1">Coef</th>
                  <th className="border px-1">Wt</th>
                  <th className="border px-1">Remark</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="border px-1 font-medium">{s.name}</td>
                    {seqs.map((k) => (
                      <td key={k} className="border px-1 text-center">
                        {s[k as keyof Subject] ?? "-"}
                      </td>
                    ))}
                    <td className="border px-1 text-center">
                      {calculateSubjectAverage(s)}
                    </td>
                    <td className="border px-1 text-center">{s.coefficient}</td>
                    <td className="border px-1 text-center">
                      {calculateWeightedAvg(s)}
                    </td>
                    <td className="border px-1">{s.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER BAND */}
        <div className="mt-6 border-t pt-3 grid grid-cols-2 gap-4">
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* ACADEMIC SUMMARY */}
            <table className="w-full border border-gray-400 border-collapse text-[9px]">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={2} className="border px-1 py-1 text-[10px] font-semibold">
                    Academic Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-1 font-semibold">Average</td>
                  <td className="border px-1 text-center font-bold">
                    {getDisplayAverage()}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border px-1 font-semibold">Position</td>
                  <td className="border px-1 text-center font-bold">
                    {getDisplayPosition()}
                  </td>
                </tr>
                <tr>
                  <td className="border px-1">Class Average</td>
                  <td className="border px-1 text-center">
                    {classAverage ?? "-"}
                  </td>
                </tr>

                {displayMode === "annual" && (
                  <>
                    <tr className="bg-gray-50">
                      <td className="border px-1">1st Term Avg</td>
                      <td className="border px-1 text-center">
                        {firstTermAvg ?? "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-1">2nd Term Avg</td>
                      <td className="border px-1 text-center">
                        {secondTermAvg ?? "-"}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-1">3rd Term Avg</td>
                      <td className="border px-1 text-center">
                        {thirdTermAvg ?? "-"}
                      </td>
                    </tr>
                  </>
                )}

                {councilDecision && (
                  <tr>
                    <td className="border px-1 font-semibold">Council Decision</td>
                    <td className="border px-1 text-center">
                      {councilDecision}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* DISCIPLINE SUMMARY */}
            <table className="w-full border border-gray-400 border-collapse text-[9px]">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={2} className="border px-1 py-1 text-[10px] font-semibold">
                    Discipline Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-1">Absences</td>
                  <td className="border px-1 text-center">
                    {absences ?? "-"}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border px-1">Lateness</td>
                  <td className="border px-1 text-center">
                    {lateness ?? "-"}
                  </td>
                </tr>
                <tr>
                  <td className="border px-1">Behavior</td>
                  <td className="border px-1 text-center">
                    {behavior ?? "-"}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border px-1">Remarks</td>
                  <td className="border px-1 text-center">
                    {disciplineRemarks ?? "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="flex justify-between">
            <div className="text-center">
              <div className="border-b w-36 mb-1"></div>
              <p>{classMaster}</p>
              <p className="italic">Class Master</p>
            </div>
            <div className="text-center">
              <div className="border-b w-36 mb-1"></div>
              <p>{principalName}</p>
              <p className="italic">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCardTemplateB;

"use client";

import React from "react";
import { Subject, ReportCardProps } from "@/components/reportcard/datatypes";

const ReportCard: React.FC<ReportCardProps> = ({
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
  cardId = "report-card",
}) => {
  // --- Helper functions ---
  const calculateSubjectAverage = (subject: Subject) => {
    const scores: number[] = [];

    if (displayMode === "annual") {
      ["s1", "s2", "s3", "s4", "s5", "s6"].forEach((seq) => {
        const val = subject[seq as keyof Subject];
        if (typeof val === "number") scores.push(val);
      });
    } else if (displayMode === "first-term") {
      ["s1", "s2"].forEach((seq) => {
        const val = subject[seq as keyof Subject];
        if (typeof val === "number") scores.push(val);
      });
    } else if (displayMode === "second-term") {
      ["s3", "s4"].forEach((seq) => {
        const val = subject[seq as keyof Subject];
        if (typeof val === "number") scores.push(val);
      });
    } else if (displayMode === "third-term") {
      ["s5", "s6"].forEach((seq) => {
        const val = subject[seq as keyof Subject];
        if (typeof val === "number") scores.push(val);
      });
    } else {
      const val = subject[displayMode as keyof Subject];
      if (typeof val === "number") scores.push(val);
    }

    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "-";
  };

  const calculateWeightedAvg = (subject: Subject) => {
    const avg = parseFloat(calculateSubjectAverage(subject));
    return isNaN(avg) ? "-" : (avg * subject.coefficient).toFixed(1);
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

  const seqToShow = sequencesToShow();

  const totalCoefficient = subjects.reduce((sum, s) => sum + s.coefficient, 0);
  const totalWeighted = subjects.reduce((sum, s) => {
    const w = parseFloat(calculateWeightedAvg(s));
    return sum + (isNaN(w) ? 0 : w);
  }, 0);

  // --- Term/Subheading mapping for Annual mode ---
  const termSubHeaders = displayMode === "annual" ? [
    { term: "1st Term", sequences: ["S1", "S2"] },
    { term: "2nd Term", sequences: ["S3", "S4"] },
    { term: "3rd Term", sequences: ["S5", "S6"] },
  ] : displayMode.includes("term") ? [
    { term: displayMode.replace("-", " ").toUpperCase(), sequences: seqToShow.map(s => s.toUpperCase()) },
  ] : [
    { term: displayMode.toUpperCase(), sequences: [displayMode.toUpperCase()] },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div id={cardId} className="w-[794px] min-h-[1123px] bg-white border border-gray-300 shadow-xl text-[9px] p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h3 className="text-[10px] font-semibold uppercase">Republic of Cameroon</h3>
            <p className="text-sm italic">Peace – Work – Fatherland</p>
            <h4 className="text-[10px] font-medium uppercase mt-1">Ministry of Secondary Education</h4>
            <h4 className="text-[13px] font-bold uppercase mt-1">{schoolName}</h4>
            <p className="text-sm mt-1">{schoolMotto}</p>
            <p className="text-[10px] font-medium uppercase mt-1">Tel: {schoolTel}</p>
          </div>

          <div className="mx-6 w-24 h-24 flex items-center justify-center">
            <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center flex-1">
            <h3 className="text-[10px] font-semibold uppercase">République du Cameroun</h3>
            <p className="text-sm italic">Paix – Travail – Patrie</p>
            <h4 className="text-[10px] font-medium uppercase mt-1">Ministère de l'Enseignement Secondaire</h4>
            <h4 className="text-[13px] font-bold uppercase mt-1">{schoolName}</h4>
            <p className="text-sm mt-1">{schoolMotto}</p>
            <p className="text-[10px] font-medium uppercase mt-1">Tel: {schoolTel}</p>
          </div>
        </div>

        {/* STUDENT INFO */}
        <div className="mt-6 border border-gray-400 p-3 flex gap-4">
          <div className="flex-1">
            <div className="mb-3 text-center">
              <h1 className="text-[12px] font-bold uppercase">Report Card</h1>
              <p className="text-[9px]">{academicYear} / {displayMode.toUpperCase()}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[9px]">
              <p><span className="font-semibold">Student Name:</span> {studentName}</p>
              <p><span className="font-semibold">Matricule:</span> {matricule}</p>
              <p><span className="font-semibold">Date of Birth:</span> {dateOfBirth}</p>
              <p><span className="font-semibold">Place of Birth:</span> {placeOfBirth}</p>
              <p><span className="font-semibold">Class:</span> {className}</p>
              <p><span className="font-semibold">Class Master:</span> {classMaster}</p>
            </div>
          </div>

          <div className="w-24 flex-shrink-0 flex items-start justify-center">
            <div className="w-20 h-24 overflow-hidden">
              <img src={passportPhoto} alt="Student" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-gray-400 text-[9px] border-collapse">
            <thead>
              <tr>
                <th className="border px-1 py-1" rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2}>
                  Subject
                </th>
                {termSubHeaders.map((t, idx) => (
                  <th
                    key={idx}
                    colSpan={t.sequences.length}
                    className="border px-1 py-1"
                  >
                    {t.term}
                  </th>
                ))}
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Average
                </th>
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Coef.
                </th>
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Weighted
                </th>
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Pos.
                </th>
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Teacher
                </th>
                <th rowSpan={termSubHeaders.every(t => t.sequences.length === 1) ? 1 : 2} className="border px-1 py-1">
                  Remark
                </th>
              </tr>

              {termSubHeaders.some(t => t.sequences.length > 1) && (
                <tr>
                  {termSubHeaders.flatMap(t => t.sequences).map((seq) => (
                    <th key={seq} className="border px-1 py-1">
                      {seq}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {subjects.map((subject, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-1">{subject.name}</td>
                  {termSubHeaders.flatMap(t => t.sequences).map((seq) => (
                    <td key={seq} className="border px-1 text-center">
                      {subject[seq.toLowerCase() as keyof Subject] ?? "-"}
                    </td>
                  ))}
                  <td className="border px-1 text-center">{calculateSubjectAverage(subject)}</td>
                  <td className="border px-1 text-center">{subject.coefficient}</td>
                  <td className="border px-1 text-center">{calculateWeightedAvg(subject)}</td>
                  <td className="border px-1 text-center">{subject.position ?? "-"}</td>
                  <td className="border px-1">{subject.teacher}</td>
                  <td className="border px-1">{subject.remark}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border px-1">TOTAL</td>
                <td className="border px-1" colSpan={seqToShow.length}></td>
                <td className="border px-1 text-center"></td>
                <td className="border px-1 text-center">{totalCoefficient}</td>
                <td className="border px-1 text-center">{totalWeighted.toFixed(1)}</td>
                <td className="border px-1" colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SUMMARY SECTION */}
        <div className="mt-6 border border-gray-400 p-2 text-[9px]">
          <h2 className="text-[11px] font-bold uppercase text-center mb-2">
            {displayMode === "annual" ? "Annual Summary & Remarks" : "Term Summary & Remarks"}
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <div className="bg-gray-200 border-2 border-gray-400 rounded-lg p-2 text-center shadow-sm">
                <p className="text-[10px] font-semibold">Average</p>
                <p className="text-[16px] font-bold text-black mb-2">{getDisplayAverage()}</p>
                <p className="text-[10px] font-semibold">Position</p>
                <p className="text-[16px] font-bold text-black">{getDisplayPosition()}</p>
              </div>

              <table className="w-full border border-gray-400 text-[9px] border-collapse mt-1">
                <tbody>
                  <tr className="bg-gray-100">
                    <td className="border px-1 font-semibold">1st Term Avg</td>
                    <td className="border px-1 text-center">{firstTermAvg ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="border px-1 font-semibold">2nd Term Avg</td>
                    <td className="border px-1 text-center">{secondTermAvg ?? "-"}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-1 font-semibold">3rd Term Avg</td>
                    <td className="border px-1 text-center">{thirdTermAvg ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="border px-1 font-semibold">Class Average</td>
                    <td className="border px-1 text-center">{classAverage ?? "-"}</td>
                  </tr>
                  {councilDecision && (
                    <tr className="bg-gray-100">
                      <td className="border px-1 font-semibold">Council Decision</td>
                      <td className="border px-1 text-center">{councilDecision}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Discipline Section */}
            <table className="w-full border border-gray-400 text-[9px] border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-1 text-[10px] font-semibold">Discipline</th>
                  <th className="border px-1"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-1 font-semibold">Absences</td>
                  <td className="border px-1 text-center">{absences ?? "-"}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border px-1 font-semibold">Lateness</td>
                  <td className="border px-1 text-center">{lateness ?? "-"}</td>
                </tr>
                <tr>
                  <td className="border px-1 font-semibold">Behavior</td>
                  <td className="border px-1 text-center">{behavior ?? "-"}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border px-1 font-semibold">Remarks</td>
                  <td className="border px-1 text-center">{disciplineRemarks ?? "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="mt-8 flex justify-between items-end text-[9px]">
          <div className="flex flex-col items-center">
            <div className="border-b border-black w-40 mb-1"></div>
            <p className="text-center">Class Master's Signature</p>
            <p className="text-[8px] mt-1">{classMaster}</p>
            <p className="text-[8px] italic">Class Master</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="border-b border-black w-40 mb-1"></div>
            <p className="text-center">Principal's Signature</p>
            <p className="text-[8px] mt-1">{principalName}</p>
            <p className="text-[8px] italic">Principal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

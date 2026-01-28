"use client"
import { DisplayMode } from "@/components/reportcard/datatypes";
import { TemplateKey } from "@/components/reportcard/SettingsModal";
export const DEFAULT_SETTINGS: {
  templateName: TemplateKey;
  passingGrade: number;
  classMaster: string;
} = {
  templateName: "TemplateA",
  passingGrade: 10,
  classMaster: "",
};

export interface ReportCardSettingsPayload {
  schoolId: string;
  classId: string;
  displayMode: DisplayMode;
  academicYear: string;

  settings: {
    templateName: TemplateKey;
    passingGrade: number;
    classMaster: string;
  };

  updatedAt: string;
}


const storageKey = (schoolId: string, classId: string) =>
  `report-card-settings:${schoolId}:${classId}`;

export const saveReportCardSettings = (
  payload: ReportCardSettingsPayload
) => {
  const key = `report-card-settings:${payload.schoolId}`;

  const existing: ReportCardSettingsPayload[] =
    JSON.parse(localStorage.getItem(key) || "[]");

  const index = existing.findIndex(
    (item) =>
      item.schoolId === payload.schoolId &&
      item.classId === payload.classId &&
      item.displayMode === payload.displayMode &&
      item.academicYear === payload.academicYear
  );

  if (index !== -1) {
    existing[index] = payload; // update
  } else {
    existing.push(payload); // insert
  }

  localStorage.setItem(key, JSON.stringify(existing));
};


export const loadReportCardSettings = (
  schoolId: string,
  classId: string,
  displayMode: DisplayMode,
  academicYear: string
): ReportCardSettingsPayload | null => {
  const key = `report-card-settings:${schoolId}`;
  const all: ReportCardSettingsPayload[] =
    JSON.parse(localStorage.getItem(key) || "[]");

  return (
    all.find(
      (item) =>
        item.schoolId === schoolId &&
        item.classId === classId &&
        item.displayMode === displayMode &&
        item.academicYear === academicYear
    ) || null
  );
};

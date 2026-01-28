import { DisplayMode } from "@/components/reportcard/datatypes";
import { TemplateKey } from "@/components/reportcard/SettingsModal";

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

export const saveReportCardSettings = async (
  payload: ReportCardSettingsPayload
) => {
  const res = await fetch("/api/report-card-settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save report card settings");
  }
};

export const loadReportCardSettings = async (
  schoolId: string,
  classId: string,
  displayMode: DisplayMode,
  academicYear: string
): Promise<ReportCardSettingsPayload | null> => {
  const params = new URLSearchParams({
    schoolId,
    classId,
    displayMode,
    academicYear,
  });

  const res = await fetch(`/api/report-card-settings?${params}`);

  if (!res.ok) {
    throw new Error("Failed to load report card settings");
  }

  return res.json();
};

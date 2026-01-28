import transformReportCardData from "./transformReportCardData";
import {
  DisplayMode,
  ReportCardProps,
  SchoolConfig,
  StudentReport,
  APIResponse,
} from "./datatypes";

type ReportsApiResponse = {
  success: boolean;
  data: {
    reports: StudentReport[];
  };
};

export function transformMultipleReportCards(
  apiResponse: ReportsApiResponse,
  displayMode: DisplayMode,
  classMaster?: string
): ReportCardProps[] {
  const schoolConfig: SchoolConfig | undefined = classMaster
    ? { classMaster }
    : undefined;

  return apiResponse.data.reports.map((report: StudentReport) =>
    transformReportCardData(
      { data: report } as APIResponse,
      displayMode,
      schoolConfig
    )
  );
}

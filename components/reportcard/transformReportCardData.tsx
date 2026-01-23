import { APIResponse, DisplayMode, SchoolConfig, ReportCardProps, Subject } from "./datatypes";

export default function transformReportCardData(
  apiResponse: APIResponse,
  displayMode: DisplayMode,
  schoolConfig?: SchoolConfig
): ReportCardProps {
  const { student, school, class: classInfo, academic_performance, annual_summary } = apiResponse.data;

  // Format date of birth
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  function getRankSuffix(rank: number): string {
    const j = rank % 10;
    const k = rank % 100;
    if (j === 1 && k !== 11) return `${rank}st`;
    if (j === 2 && k !== 12) return `${rank}nd`;
    if (j === 3 && k !== 13) return `${rank}rd`;
    return `${rank}th`;
  }

  function generateAnnualRemarks(record: any): string {
    if (record.dismissed) return 'Student has been dismissed due to serious disciplinary issues.';
    if (record.total_discipline_count === 0 && record.total_absences === 0) return 'Excellent conduct and attendance throughout the year.';
    if (record.total_discipline_count > 5) return 'Multiple disciplinary incidents. Improvement needed.';
    if (record.total_unjustified_absences > 10) return 'High number of unjustified absences. Must improve.';
    return 'Generally acceptable conduct with room for improvement.';
  }

  function generateSequenceRemarks(record: any): string {
    if (record.discipline_count === 0 && record.absences_count === 0) return 'Excellent conduct and attendance.';
    if (record.discipline_count > 2) return 'Multiple disciplinary incidents. Needs improvement.';
    if (record.unjustified_absences > 3) return 'Too many unjustified absences.';
    return 'Acceptable conduct overall.';
  }

  // Build subjects map with all sequence marks and teacher info
  const subjectsMap = new Map<string, Subject>();
  academic_performance.forEach((term, termIndex) => {
    term.sequences.forEach((sequence, seqIndex) => {
      sequence.subjects.forEach((subject) => {
        if (!subjectsMap.has(subject.subject_id)) {
          subjectsMap.set(subject.subject_id, {
            name: subject.name,
            coefficient: subject.coefficient,
            teacher: subject.teacher_name || 'N/A',
            remark: subject.comments || 'N/A',
          });
        }

        const existingSubject = subjectsMap.get(subject.subject_id)!;
        const sequenceKey = `s${termIndex * 2 + seqIndex + 1}` as 's1' | 's2' | 's3' | 's4' | 's5' | 's6';

        if (subject.mark !== 'XX' && typeof subject.mark === 'number') {
          existingSubject[sequenceKey] = subject.mark;
        }

        // Add position if available
        if (subject.ranking_in_subject) {
          existingSubject.position = getRankSuffix(subject.ranking_in_subject);
        }
      });
    });
  });

  const subjects = Array.from(subjectsMap.values());

  const getClassSize = (performers: any[]) => performers.length;

  // --- TERM / SEQUENCE MODES ---
  const seqMap: Record<string, { term: number; seq: number }> = {
    s1: { term: 0, seq: 0 },
    s2: { term: 0, seq: 1 },
    s3: { term: 1, seq: 0 },
    s4: { term: 1, seq: 1 },
    s5: { term: 2, seq: 0 },
    s6: { term: 2, seq: 1 },
  };

  let termSummary: any;
  let sequenceData: any;
  let isSequenceMode = false;

  if (displayMode === 'first-term') termSummary = academic_performance[0].term_summary;
  else if (displayMode === 'second-term') termSummary = academic_performance[1].term_summary;
  else if (displayMode === 'third-term') termSummary = academic_performance[2].term_summary;
  else if (displayMode.startsWith('s')) {
    isSequenceMode = true;
    const { term, seq } = seqMap[displayMode];
    termSummary = academic_performance[term].term_summary;
    sequenceData = academic_performance[term].sequences[seq];
  }

  // --- TERM AVERAGES (always from annual_summary) ---
  const firstTermAvg = annual_summary.term_averages.term_1;
  const secondTermAvg = annual_summary.term_averages.term_2;
  const thirdTermAvg = annual_summary.term_averages.term_3;

  // --- CLASS AVERAGE ---
  const classAverage = isSequenceMode ? sequenceData?.class_average : termSummary?.class_average;

  // --- COUNCIL DECISION ---
  const councilDecision = displayMode === 'annual' ? annual_summary.status : undefined;

  const classSize = termSummary?.top_performers ? getClassSize(termSummary.top_performers) : 0;

  return {
    schoolName: school.name,
    schoolLogo: school.logo,
    schoolTel: school.phone_number,
    schoolMotto: school.devise,
    studentName: student.name,
    matricule: student.student_id,
    dateOfBirth: formatDate(student.date_of_birth),
    placeOfBirth: student.place_of_birth,
    className: classInfo.name,
    classMaster: schoolConfig?.classMaster || classInfo.class_master || 'N/A',
    academicYear: student.academic_year,
    passportPhoto: student.avatar,
    subjects,
    displayMode,
    annualAverage: termSummary?.average_on_20 || annual_summary.annual_average,
    position: `${termSummary?.rank_in_class || annual_summary.rank_in_class}${classSize > 0 ? ` / ${classSize}` : ''}`,
    firstTermAvg,
    secondTermAvg,
    thirdTermAvg,
    classAverage,
    councilDecision,
    absences: `${termSummary?.disciplinary_record?.absences_count || 0} days`,
    lateness: 'N/A',
    behavior: termSummary?.disciplinary_record?.discipline_count > 0 ? 'Fair' : 'Good',
    disciplineRemarks: isSequenceMode ? generateSequenceRemarks(sequenceData.disciplinary_record) : generateAnnualRemarks(annual_summary.disciplinary_record),
    principalName: school.principal_name,
  };
}

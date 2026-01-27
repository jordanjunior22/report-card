export interface Subject {
    name: string;
    s1?: number;
    s2?: number;
    s3?: number;
    s4?: number;
    s5?: number;
    s6?: number;
    coefficient: number;
    position?: string;
    teacher: string;
    remark: string;
}

export interface APIResponse {
    success: boolean;
    data: {
        student: {
            id: string;
            student_id: string;
            name: string;
            age: number;
            gender: string;
            date_of_birth: string;
            place_of_birth: string;
            avatar: string;
            academic_year: string;
        };
        school: {
            id: string;
            school_id: string;
            name: string;
            phone_number: string;
            logo: string;
            devise: string;
            principal_name: string;
        };
        class: {
            id: string;
            name: string;
            class_master: string | null;
        };
        academic_performance: Array<{
            term_id: number;
            term_name: string;
            sequences: Array<{
                sequence_id: number;
                sequence_name: string;
                subjects: Array<{
                    subject_id: string;
                    name: string;
                    coefficient: number;
                    mark: number | string;
                    score: number | null;
                    teacher_name: string;
                    comments: string;
                    ranking_in_subject: number | null;
                }>;
                average_on_20: number;
                rank_in_class: number;
                class_average?: number;
                top_performers: Array<{
                    student_id: string;
                    name: string;
                    average_on_20: number;
                    rank: number;
                }>;
                disciplinary_record: {
                    discipline_count: number;
                    absences_count: number;
                    unjustified_absences: number;
                };
            }>;
            term_summary: {
                subjects: Array<{
                    subject_id: string;
                    name: string;
                    coefficient: number;
                    sequence_1_mark: number | string;
                    sequence_2_mark: number | string;
                    term_average: number;
                    term_score: number;
                    teacher_name: string;
                    comments: string;
                    ranking_in_subject: number | null;
                }>;
                average_on_20: number;
                rank_in_class: number;
                class_average?: number;
                top_performers: Array<{
                    student_id: string;
                    name: string;
                    average_on_20: number;
                    rank: number;
                }>;
                disciplinary_record: {
                    discipline_count: number;
                    absences_count: number;
                    unjustified_absences: number;
                };
            };
        }>;
        annual_summary: {
            term_averages: {
                term_1: number;
                term_2: number;
                term_3: number;
            };
            annual_average: number;
            class_average?: number;
            rank_in_class: number;
            status: string;
            top_performers: Array<{
                student_id: string;
                name: string;
                average_on_20: number;
                rank: number;
            }>;
            disciplinary_record: {
                total_discipline_count: number;
                total_absences: number;
                total_unjustified_absences: number;
                dismissed: boolean;
            };
        };
    };
}

export type DisplayMode = 'first-term' | 'second-term' | 'third-term' | 'annual' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6';
export interface SchoolConfig {
    // Optional overrides - if not provided, uses API data
    classMaster?: string;
}

export interface ReportCardProps {
    schoolName: string;
    schoolLogo: string;
    schoolTel: string;
    schoolMotto: string;
    studentName: string;
    matricule: string;
    dateOfBirth: string;
    placeOfBirth: string;
    className: string;
    classMaster: string;
    academicYear: string;
    passportPhoto: string;
    subjects: Subject[];
    displayMode: 'first-term' | 'second-term' | 'third-term' | 'annual' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6';
    annualAverage?: number;
    position?: string;
    firstTermAvg?: number;
    secondTermAvg?: number;
    thirdTermAvg?: number;
    classAverage?: number;
    councilDecision?: string;
    absences?: string;
    lateness?: string;
    behavior?: string;
    disciplineRemarks?: string;
    principalName: string;
    cardId?: string;
    sequencePosition?: number;
}

export type StudentReport = {
  student: {
    id: string;
    student_id: string;
    name: string;
    age: number;
    gender: string;
    date_of_birth: string;
    place_of_birth: string;
    avatar: string;
    academic_year: string;
  };
  school: {
    id: string;
    school_id: string;
    name: string;
    phone_number: string;
    logo: string;
    devise: string;
    principal_name: string;
  };
  class: {
    id: string;
    name: string;
    class_master: string | null;
  };
  academic_performance: {
    term_id: number;
    term_name: string;
    sequences: {
      sequence_id: number;
      sequence_name: string;
      subjects: {
        subject_id: string;
        name: string;
        coefficient: number;
        mark: number | string;
        score: number | null;
        teacher_name: string;
        comments: string;
        ranking_in_subject: number | null;
      }[];
      average_on_20: number;
      rank_in_class: number;
      class_average?: number;
      top_performers: {
        student_id: string;
        name: string;
        average_on_20: number;
        rank: number;
      }[];
      disciplinary_record: {
        discipline_count: number;
        absences_count: number;
        unjustified_absences: number;
      };
    }[];
    term_summary: {
      subjects: {
        subject_id: string;
        name: string;
        coefficient: number;
        sequence_1_mark: number | string;
        sequence_2_mark: number | string;
        term_average: number;
        term_score: number;
        teacher_name: string;
        comments: string;
        ranking_in_subject: number | null;
      }[];
      average_on_20: number;
      rank_in_class: number;
      class_average?: number;
      top_performers: {
        student_id: string;
        name: string;
        average_on_20: number;
        rank: number;
      }[];
      disciplinary_record: {
        discipline_count: number;
        absences_count: number;
        unjustified_absences: number;
      };
    };
  }[];
  annual_summary: {
    term_averages: {
      term_1: number;
      term_2: number;
      term_3: number;
    };
    annual_average: number;
    rank_in_class: number;
    status: string;
    top_performers: {
      student_id: string;
      name: string;
      average_on_20: number;
      rank: number;
    }[];
    disciplinary_record: {
      total_discipline_count: number;
      total_absences: number;
      total_unjustified_absences: number;
      dismissed: boolean;
    };
  };
};

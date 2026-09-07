export type Role = "teacher" | "student" | "principal";

export type AssessmentStatus =
  | "draft"
  | "review"
  | "published"
  | "available"
  | "in_progress"
  | "submitted"
  | "evaluated"
  | "results_available"
  | "closed";

export type MaterialStatus = "uploading" | "processing" | "ready" | "failed";

export type Level = "strong" | "medium" | "weak";

export interface Concept {
  id: string;
  name: string;
  description: string;
  subject: string;
}

export interface Material {
  id: string;
  filename: string;
  fileType: "PDF" | "DOCX" | "TXT";
  sizeKb: number;
  classId: string;
  status: MaterialStatus;
  uploadedAt: string;
  conceptIds: string[];
  errorMessage?: string;
  progress?: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classIds: string[];
  avgScore: number;
  lastAttempt: string | null;
  conceptPerformance: { conceptId: string; accuracy: number }[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classIds: string[];
  assessmentsCreated: number;
  avgClassScore: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  teacherId: string;
  joinCode: string;
  studentIds: string[];
  assessmentIds: string[];
  lastActivity: string;
  avgScore: number;
  completionRate: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  conceptId: string;
  aiGenerated: boolean;
  position: number;
}

export interface Assessment {
  id: string;
  title: string;
  classId: string;
  materialId: string | null;
  status: AssessmentStatus;
  createdAt: string;
  dueDate: string | null;
  questions: Question[];
  participation: { submitted: number; total: number };
  avgScore: number;
  passRate: number;
}

export interface StudentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
  conceptBreakdown: { conceptId: string; correct: number; total: number; accuracy: number }[];
}

export interface LearningGap {
  conceptId: string;
  classId: string;
  accuracy: number;
  affectedStudentIds: string[];
  severity: "high" | "moderate";
  suggestedAction: string;
  aiSuggestion: string;
}

import type {
  Assessment,
  ClassRoom,
  Concept,
  LearningGap,
  Level,
  Material,
  Question,
  Student,
  StudentResult,
  Teacher,
} from "./types";

/* ---------------------------------------------------------------- helpers */

export function levelOf(accuracy: number): Level {
  if (accuracy >= 80) return "strong";
  if (accuracy >= 50) return "medium";
  return "weak";
}

export function isPass(percentage: number): boolean {
  return percentage > 50;
}

/** Deterministic pseudo-random in [0,1) from a string seed. */
function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function between(seed: string, min: number, max: number): number {
  return Math.round(min + seeded(seed) * (max - min));
}

/* --------------------------------------------------------------- concepts */

export const concepts: Concept[] = [
  {
    id: "c-linear",
    name: "Linear Equations",
    description: "Solving one-variable equations by isolating the unknown term.",
    subject: "Mathematics",
  },
  {
    id: "c-fractions",
    name: "Fractions",
    description: "Equivalent fractions, comparison, and operations with unlike denominators.",
    subject: "Mathematics",
  },
  {
    id: "c-algebraic",
    name: "Algebraic Expressions",
    description: "Simplifying expressions by combining like terms and applying distribution.",
    subject: "Mathematics",
  },
  {
    id: "c-geometry",
    name: "Angles and Triangles",
    description: "Angle sum properties, triangle classification, and interior angle reasoning.",
    subject: "Mathematics",
  },
  {
    id: "c-ratio",
    name: "Ratio and Proportion",
    description: "Comparing quantities and solving direct proportion word problems.",
    subject: "Mathematics",
  },
  {
    id: "c-photosynthesis",
    name: "Photosynthesis",
    description: "How plants convert light energy into chemical energy stored as glucose.",
    subject: "Science",
  },
  {
    id: "c-force",
    name: "Force and Motion",
    description: "Balanced and unbalanced forces, friction, and Newton's laws in daily life.",
    subject: "Science",
  },
  {
    id: "c-cell",
    name: "Cell Structure",
    description: "Organelles of plant and animal cells and their primary functions.",
    subject: "Science",
  },
];

export const conceptById = (id: string) =>
  concepts.find((c) => c.id === id) ?? {
    id,
    name: "Unknown concept",
    description: "",
    subject: "",
  };

/* --------------------------------------------------------------- teachers */

export const teachers: Teacher[] = [
  {
    id: "t-1",
    name: "Priya Raman",
    email: "priya.raman@brightfield.edu",
    subject: "Mathematics",
    classIds: ["cl-8a", "cl-9a"],
    assessmentsCreated: 14,
    avgClassScore: 68,
  },
  {
    id: "t-2",
    name: "Daniel Okafor",
    email: "daniel.okafor@brightfield.edu",
    subject: "Science",
    classIds: ["cl-8b"],
    assessmentsCreated: 9,
    avgClassScore: 61,
  },
  {
    id: "t-3",
    name: "Meera Iyer",
    email: "meera.iyer@brightfield.edu",
    subject: "Mathematics",
    classIds: ["cl-9b"],
    assessmentsCreated: 11,
    avgClassScore: 74,
  },
  {
    id: "t-4",
    name: "Samuel Fernandes",
    email: "samuel.fernandes@brightfield.edu",
    subject: "Science",
    classIds: ["cl-7a"],
    assessmentsCreated: 6,
    avgClassScore: 57,
  },
];

/** The signed-in teacher for the prototype. */
export const CURRENT_TEACHER_ID = "t-1";
export const CURRENT_STUDENT_ID = "s-1";

/* --------------------------------------------------------------- students */

const studentNames = [
  "Aarav Sharma",
  "Ananya Krishnan",
  "Ibrahim Khan",
  "Sofia Martins",
  "Rohan Verma",
  "Grace Mensah",
  "Kavya Nair",
  "Liam O'Connor",
  "Diya Patel",
  "Noah Bergman",
  "Zara Ahmed",
  "Vikram Reddy",
  "Elena Petrova",
  "Arjun Mehta",
  "Chloe Dubois",
  "Tanvi Joshi",
  "Mateo Alvarez",
  "Isabel Santos",
  "Hana Suzuki",
  "Eli Rosenberg",
  "Nisha Gupta",
  "Omar Haddad",
];

const classAssignment: Record<string, string[]> = {
  "cl-8a": studentNames.slice(0, 7).map((_, i) => `s-${i + 1}`),
  "cl-8b": studentNames.slice(7, 13).map((_, i) => `s-${i + 8}`),
  "cl-9a": studentNames.slice(13, 18).map((_, i) => `s-${i + 14}`),
  "cl-9b": studentNames.slice(18, 21).map((_, i) => `s-${i + 19}`),
  "cl-7a": [`s-22`],
};

export const students: Student[] = studentNames.map((name, i) => {
  const id = `s-${i + 1}`;
  const classIds = Object.entries(classAssignment)
    .filter(([, ids]) => ids.includes(id))
    .map(([cid]) => cid);
  const conceptPerformance = concepts.map((c) => ({
    conceptId: c.id,
    accuracy: between(`${id}-${c.id}`, 28, 97),
  }));
  const avgScore = Math.round(
    conceptPerformance.reduce((s, c) => s + c.accuracy, 0) / conceptPerformance.length,
  );
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@brightfield.edu`,
    classIds,
    avgScore,
    lastAttempt: i % 9 === 0 ? null : `2026-09-0${(i % 6) + 1}`,
    conceptPerformance,
  };
});

export const studentById = (id: string) => students.find((s) => s.id === id);

/* ---------------------------------------------------------------- classes */

export const classes: ClassRoom[] = [
  {
    id: "cl-8a",
    name: "Class 8A — Mathematics",
    subject: "Mathematics",
    grade: "Grade 8",
    teacherId: "t-1",
    joinCode: "M8A24K",
    studentIds: classAssignment["cl-8a"],
    assessmentIds: ["a-1", "a-2", "a-5"],
    lastActivity: "2026-09-06",
    avgScore: 67,
    completionRate: 86,
  },
  {
    id: "cl-8b",
    name: "Class 8B — Science",
    subject: "Science",
    grade: "Grade 8",
    teacherId: "t-2",
    joinCode: "S8BQ71",
    studentIds: classAssignment["cl-8b"],
    assessmentIds: ["a-3"],
    lastActivity: "2026-09-05",
    avgScore: 61,
    completionRate: 78,
  },
  {
    id: "cl-9a",
    name: "Class 9A — Mathematics",
    subject: "Mathematics",
    grade: "Grade 9",
    teacherId: "t-1",
    joinCode: "M9AX35",
    studentIds: classAssignment["cl-9a"],
    assessmentIds: ["a-4"],
    lastActivity: "2026-09-04",
    avgScore: 72,
    completionRate: 92,
  },
  {
    id: "cl-9b",
    name: "Class 9B — Mathematics",
    subject: "Mathematics",
    grade: "Grade 9",
    teacherId: "t-3",
    joinCode: "M9BR08",
    studentIds: classAssignment["cl-9b"],
    assessmentIds: [],
    lastActivity: "2026-08-29",
    avgScore: 74,
    completionRate: 81,
  },
  {
    id: "cl-7a",
    name: "Class 7A — Science",
    subject: "Science",
    grade: "Grade 7",
    teacherId: "t-4",
    joinCode: "S7AD46",
    studentIds: classAssignment["cl-7a"],
    assessmentIds: [],
    lastActivity: "2026-08-22",
    avgScore: 57,
    completionRate: 64,
  },
];

export const classById = (id: string) => classes.find((c) => c.id === id);
export const teacherById = (id: string) => teachers.find((t) => t.id === id);

/* -------------------------------------------------------------- materials */

export const materials: Material[] = [
  {
    id: "m-1",
    filename: "Chapter 4 — Linear Equations.pdf",
    fileType: "PDF",
    sizeKb: 842,
    classId: "cl-8a",
    status: "ready",
    uploadedAt: "2026-09-01",
    conceptIds: ["c-linear", "c-algebraic", "c-fractions"],
  },
  {
    id: "m-2",
    filename: "Fractions Practice Notes.docx",
    fileType: "DOCX",
    sizeKb: 316,
    classId: "cl-8a",
    status: "ready",
    uploadedAt: "2026-08-27",
    conceptIds: ["c-fractions", "c-ratio"],
  },
  {
    id: "m-3",
    filename: "Photosynthesis — Unit Handout.pdf",
    fileType: "PDF",
    sizeKb: 1204,
    classId: "cl-8b",
    status: "processing",
    uploadedAt: "2026-09-07",
    conceptIds: [],
  },
  {
    id: "m-4",
    filename: "Force and Motion Worksheet.txt",
    fileType: "TXT",
    sizeKb: 64,
    classId: "cl-8b",
    status: "failed",
    uploadedAt: "2026-09-03",
    conceptIds: [],
    errorMessage: "We couldn't read enough text from this file to extract concepts.",
  },
  {
    id: "m-5",
    filename: "Geometry — Angles and Triangles.pdf",
    fileType: "PDF",
    sizeKb: 967,
    classId: "cl-9a",
    status: "ready",
    uploadedAt: "2026-08-24",
    conceptIds: ["c-geometry", "c-ratio"],
  },
];

export const materialById = (id: string) => materials.find((m) => m.id === id);

/* -------------------------------------------------------------- questions */

function q(
  id: string,
  text: string,
  options: string[],
  correctIndex: number,
  conceptId: string,
  position: number,
  aiGenerated = true,
): Question {
  return { id, text, options, correctIndex, conceptId, aiGenerated, position };
}

const linearQuestions: Question[] = [
  q(
    "q-1",
    "Solve for x:  3x + 7 = 22",
    ["x = 3", "x = 5", "x = 7", "x = 15"],
    1,
    "c-linear",
    1,
  ),
  q(
    "q-2",
    "Which operation should be performed first when solving 4(x − 2) = 20?",
    [
      "Divide both sides by 4",
      "Add 2 to both sides",
      "Multiply both sides by 2",
      "Subtract 20 from both sides",
    ],
    0,
    "c-linear",
    2,
  ),
  q(
    "q-3",
    "Simplify the expression:  5a + 3b − 2a + b",
    ["3a + 4b", "7a + 2b", "3a + 2b", "5a + 4b"],
    0,
    "c-algebraic",
    3,
  ),
  q(
    "q-4",
    "Which fraction is equivalent to 3/4?",
    ["6/9", "9/12", "4/5", "12/20"],
    1,
    "c-fractions",
    4,
  ),
  q(
    "q-5",
    "A number decreased by 8 equals 17. Which equation represents this statement?",
    ["n + 8 = 17", "8 − n = 17", "n − 8 = 17", "n / 8 = 17"],
    2,
    "c-linear",
    5,
    false,
  ),
  q(
    "q-6",
    "What is the value of 2/3 + 1/6?",
    ["3/9", "5/6", "1/2", "3/6"],
    1,
    "c-fractions",
    6,
  ),
  q(
    "q-7",
    "Expand:  2(3x + 4)",
    ["6x + 4", "5x + 6", "6x + 8", "3x + 8"],
    2,
    "c-algebraic",
    7,
  ),
  q(
    "q-8",
    "If 7x = 56, what is the value of x?",
    ["6", "7", "8", "9"],
    2,
    "c-linear",
    8,
  ),
];

const scienceQuestions: Question[] = [
  q(
    "q-20",
    "Which pigment absorbs light energy during photosynthesis?",
    ["Haemoglobin", "Chlorophyll", "Melanin", "Carotene"],
    1,
    "c-photosynthesis",
    1,
  ),
  q(
    "q-21",
    "Photosynthesis converts carbon dioxide and water into which two products?",
    [
      "Glucose and oxygen",
      "Starch and nitrogen",
      "Protein and carbon",
      "Glucose and carbon dioxide",
    ],
    0,
    "c-photosynthesis",
    2,
  ),
  q(
    "q-22",
    "A book resting on a table does not move. This is because the forces on it are",
    ["unbalanced", "balanced", "absent", "frictionless"],
    1,
    "c-force",
    3,
  ),
  q(
    "q-23",
    "Which organelle controls the activities of a cell?",
    ["Nucleus", "Vacuole", "Cell wall", "Ribosome"],
    0,
    "c-cell",
    4,
  ),
  q(
    "q-24",
    "Friction always acts in which direction relative to motion?",
    ["The same direction", "Opposite direction", "At right angles", "Downwards"],
    1,
    "c-force",
    5,
  ),
  q(
    "q-25",
    "Which structure is found in plant cells but not in animal cells?",
    ["Mitochondria", "Cell membrane", "Chloroplast", "Cytoplasm"],
    2,
    "c-cell",
    6,
  ),
];

const geometryQuestions: Question[] = [
  q(
    "q-30",
    "The interior angles of a triangle add up to",
    ["90°", "180°", "270°", "360°"],
    1,
    "c-geometry",
    1,
  ),
  q(
    "q-31",
    "A triangle with all sides of equal length is called",
    ["Scalene", "Isosceles", "Equilateral", "Obtuse"],
    2,
    "c-geometry",
    2,
  ),
  q(
    "q-32",
    "If 4 pens cost ₹60, what is the cost of 7 pens at the same rate?",
    ["₹95", "₹100", "₹105", "₹115"],
    2,
    "c-ratio",
    3,
  ),
  q(
    "q-33",
    "Two angles of a triangle measure 55° and 65°. The third angle is",
    ["50°", "60°", "70°", "80°"],
    1,
    "c-geometry",
    4,
  ),
  q(
    "q-34",
    "The ratio 18 : 24 in its simplest form is",
    ["2 : 3", "3 : 4", "4 : 5", "9 : 12"],
    1,
    "c-ratio",
    5,
  ),
];

/* ------------------------------------------------------------ assessments */

export const assessments: Assessment[] = [
  {
    id: "a-1",
    title: "Linear Equations — Unit Check",
    classId: "cl-8a",
    materialId: "m-1",
    status: "results_available",
    createdAt: "2026-09-01",
    dueDate: "2026-09-05",
    questions: linearQuestions,
    participation: { submitted: 6, total: 7 },
    avgScore: 64,
    passRate: 71,
  },
  {
    id: "a-2",
    title: "Fractions and Ratio Quiz",
    classId: "cl-8a",
    materialId: "m-2",
    status: "published",
    createdAt: "2026-09-04",
    dueDate: "2026-09-12",
    questions: linearQuestions.slice(3, 8),
    participation: { submitted: 2, total: 7 },
    avgScore: 58,
    passRate: 50,
  },
  {
    id: "a-3",
    title: "Photosynthesis and Cells — Chapter Test",
    classId: "cl-8b",
    materialId: "m-3",
    status: "review",
    createdAt: "2026-09-06",
    dueDate: null,
    questions: scienceQuestions,
    participation: { submitted: 0, total: 6 },
    avgScore: 0,
    passRate: 0,
  },
  {
    id: "a-4",
    title: "Angles, Triangles and Proportion",
    classId: "cl-9a",
    materialId: "m-5",
    status: "results_available",
    createdAt: "2026-08-26",
    dueDate: "2026-09-02",
    questions: geometryQuestions,
    participation: { submitted: 5, total: 5 },
    avgScore: 76,
    passRate: 80,
  },
  {
    id: "a-5",
    title: "Algebraic Expressions — Practice Set",
    classId: "cl-8a",
    materialId: "m-1",
    status: "draft",
    createdAt: "2026-09-07",
    dueDate: null,
    questions: linearQuestions.slice(0, 4),
    participation: { submitted: 0, total: 7 },
    avgScore: 0,
    passRate: 0,
  },
];

export const assessmentById = (id: string) => assessments.find((a) => a.id === id);

/* ---------------------------------------------------------------- results */

export function resultsForAssessment(assessmentId: string): StudentResult[] {
  const assessment = assessmentById(assessmentId);
  if (!assessment) return [];
  const cls = classById(assessment.classId);
  if (!cls) return [];
  const conceptIds = Array.from(new Set(assessment.questions.map((q) => q.conceptId)));

  return cls.studentIds.slice(0, assessment.participation.submitted).map((studentId) => {
    const breakdown = conceptIds.map((conceptId) => {
      const total = assessment.questions.filter((q) => q.conceptId === conceptId).length;
      const accuracy =
        studentById(studentId)?.conceptPerformance.find((c) => c.conceptId === conceptId)
          ?.accuracy ?? 60;
      const correct = Math.round((accuracy / 100) * total);
      return { conceptId, correct, total, accuracy: Math.round((correct / total) * 100) };
    });
    const score = breakdown.reduce((s, b) => s + b.correct, 0);
    const total = assessment.questions.length;
    return {
      id: `r-${assessmentId}-${studentId}`,
      assessmentId,
      studentId,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      submittedAt: "2026-09-05",
      conceptBreakdown: breakdown,
    };
  });
}

export function conceptAccuracyForAssessment(assessmentId: string) {
  const results = resultsForAssessment(assessmentId);
  const map = new Map<string, { correct: number; total: number }>();
  results.forEach((r) =>
    r.conceptBreakdown.forEach((b) => {
      const prev = map.get(b.conceptId) ?? { correct: 0, total: 0 };
      map.set(b.conceptId, { correct: prev.correct + b.correct, total: prev.total + b.total });
    }),
  );
  return Array.from(map.entries()).map(([conceptId, v]) => ({
    conceptId,
    accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
  }));
}

/* ----------------------------------------------------------- learning gaps */

export const learningGaps: LearningGap[] = [
  {
    conceptId: "c-fractions",
    classId: "cl-8a",
    accuracy: 42,
    affectedStudentIds: ["s-2", "s-3", "s-5", "s-7"],
    severity: "high",
    suggestedAction: "Re-teach unlike denominators with a visual model before the next unit.",
    aiSuggestion:
      "Students appear to add numerators and denominators directly. Consider a 15-minute fraction-strip activity, then re-test with 4 short items on unlike denominators.",
  },
  {
    conceptId: "c-algebraic",
    classId: "cl-8a",
    accuracy: 48,
    affectedStudentIds: ["s-1", "s-4", "s-6"],
    severity: "high",
    suggestedAction: "Practice combining like terms and distribution in guided pairs.",
    aiSuggestion:
      "Errors cluster around distributing over subtraction. A worked-example comparison (correct vs. common error) may help before independent practice.",
  },
  {
    conceptId: "c-force",
    classId: "cl-8b",
    accuracy: 46,
    affectedStudentIds: ["s-8", "s-10", "s-12"],
    severity: "moderate",
    suggestedAction: "Use everyday examples to separate balanced from unbalanced forces.",
    aiSuggestion:
      "Consider a short demonstration with a tug-of-war rope and a sliding book, then ask students to classify five scenarios.",
  },
  {
    conceptId: "c-ratio",
    classId: "cl-9a",
    accuracy: 49,
    affectedStudentIds: ["s-15", "s-17"],
    severity: "moderate",
    suggestedAction: "Revisit unit-rate reasoning before proportion word problems.",
    aiSuggestion:
      "Students solve simple ratios but stumble on multi-step word problems. Scaffolding with a unit-rate first step may raise accuracy.",
  },
];

export function gapsForClass(classId: string) {
  return learningGaps.filter((g) => g.classId === classId);
}

/* ------------------------------------------------------------- practice */

export interface PracticeQuestion extends Question {
  explanation: string;
}

export const practiceSets: Record<string, PracticeQuestion[]> = {
  "c-fractions": [
    {
      ...q("p-1", "What is 1/2 + 1/3?", ["2/5", "5/6", "1/6", "2/6"], 1, "c-fractions", 1),
      explanation: "Use a common denominator of 6: 3/6 + 2/6 = 5/6.",
    },
    {
      ...q("p-2", "Which is larger: 3/5 or 5/8?", ["3/5", "5/8", "Equal", "Cannot tell"], 1, "c-fractions", 2),
      explanation: "3/5 = 0.60 and 5/8 = 0.625, so 5/8 is larger.",
    },
    {
      ...q("p-3", "Simplify 12/18.", ["2/3", "3/4", "6/9", "4/6"], 0, "c-fractions", 3),
      explanation: "Divide numerator and denominator by 6.",
    },
    {
      ...q("p-4", "What is 3/4 of 20?", ["12", "15", "16", "18"], 1, "c-fractions", 4),
      explanation: "20 ÷ 4 = 5, and 5 × 3 = 15.",
    },
  ],
  "c-algebraic": [
    {
      ...q("p-10", "Simplify 7x − 3x + 2.", ["4x + 2", "10x + 2", "4x − 2", "5x"], 0, "c-algebraic", 1),
      explanation: "Combine like terms: 7x − 3x = 4x, then keep +2.",
    },
    {
      ...q("p-11", "Expand 3(2y − 5).", ["6y − 5", "6y − 15", "5y − 15", "6y + 15"], 1, "c-algebraic", 2),
      explanation: "Multiply both terms inside the bracket by 3.",
    },
    {
      ...q("p-12", "Which terms are like terms?", ["4x and 4y", "3a and 7a", "2x and 2x²", "5 and 5b"], 1, "c-algebraic", 3),
      explanation: "Like terms share the same variable raised to the same power.",
    },
  ],
  "c-force": [
    {
      ...q("p-20", "A parked car experiences forces that are", ["balanced", "unbalanced", "zero friction", "increasing"], 0, "c-force", 1),
      explanation: "No change in motion means the forces cancel out.",
    },
    {
      ...q("p-21", "Friction between two surfaces increases when", ["surfaces are smoother", "surfaces are rougher", "mass decreases", "speed is zero"], 1, "c-force", 2),
      explanation: "Rougher surfaces interlock more, increasing friction.",
    },
    {
      ...q("p-22", "Newton's first law is also called the law of", ["gravity", "inertia", "momentum", "action"], 1, "c-force", 3),
      explanation: "Objects resist changes to their state of motion.",
    },
  ],
  "c-linear": [
    {
      ...q("p-30", "Solve: 2x − 6 = 10", ["x = 2", "x = 8", "x = 16", "x = 5"], 1, "c-linear", 1),
      explanation: "Add 6 to both sides, then divide by 2.",
    },
    {
      ...q("p-31", "Solve: x/3 = 7", ["x = 3", "x = 10", "x = 21", "x = 7"], 2, "c-linear", 2),
      explanation: "Multiply both sides by 3.",
    },
    {
      ...q("p-32", "Solve: 5 − x = 1", ["x = 4", "x = 6", "x = −4", "x = 1"], 0, "c-linear", 3),
      explanation: "Subtract 5 from both sides, then multiply by −1.",
    },
  ],
};

/* ---------------------------------------------------- school-wide (principal) */

export const school = {
  name: "Brightfield Public School",
  studentCount: students.length,
  classCount: classes.length,
  teacherCount: teachers.length,
  assessmentCount: assessments.length,
  avgPerformance: 68,
  passRate: 72,
  completionRate: 84,
};

export function weakStudents() {
  return students
    .map((s) => ({
      student: s,
      weakConcepts: s.conceptPerformance.filter((c) => c.accuracy < 50),
    }))
    .filter((row) => row.weakConcepts.length > 0)
    .sort((a, b) => b.weakConcepts.length - a.weakConcepts.length);
}

export function schoolWeakConcepts() {
  return concepts
    .map((c) => {
      const perf = students.map(
        (s) => s.conceptPerformance.find((p) => p.conceptId === c.id)?.accuracy ?? 0,
      );
      const accuracy = Math.round(perf.reduce((a, b) => a + b, 0) / perf.length);
      const affected = students.filter(
        (s) => (s.conceptPerformance.find((p) => p.conceptId === c.id)?.accuracy ?? 100) < 50,
      );
      const relatedClasses = Array.from(new Set(affected.flatMap((s) => s.classIds)));
      return { concept: c, accuracy, affected, relatedClasses };
    })
    .sort((a, b) => a.accuracy - b.accuracy);
}

export const completionTrend = [
  { month: "Apr", completion: 71, passRate: 63 },
  { month: "May", completion: 74, passRate: 66 },
  { month: "Jun", completion: 78, passRate: 69 },
  { month: "Jul", completion: 77, passRate: 68 },
  { month: "Aug", completion: 82, passRate: 71 },
  { month: "Sep", completion: 84, passRate: 72 },
];

export const recentActivity = [
  { id: "ac-1", text: "Ananya Krishnan submitted “Linear Equations — Unit Check”", time: "12 minutes ago" },
  { id: "ac-2", text: "Concept extraction completed for “Chapter 4 — Linear Equations.pdf”", time: "1 hour ago" },
  { id: "ac-3", text: "Ibrahim Khan joined Class 8A — Mathematics", time: "3 hours ago" },
  { id: "ac-4", text: "“Fractions and Ratio Quiz” published to Class 8A", time: "Yesterday" },
  { id: "ac-5", text: "Rohan Verma submitted “Linear Equations — Unit Check”", time: "Yesterday" },
];

export const aiSchoolReview = {
  generatedAt: "7 September 2026, 09:15",
  findings: [
    "Fractions is the lowest-performing concept school-wide, with an average accuracy of 47% across Grade 8.",
    "Grade 9 classes outperform Grade 8 by roughly 11 percentage points on shared mathematics concepts.",
    "Participation is strong (84% completion) but pass rates lag in Science assessments.",
  ],
  attention: [
    "Class 8A — Mathematics: two Weak concepts affecting 7 of 7 students.",
    "Class 8B — Science: Force and Motion accuracy at 46%.",
    "Class 7A — Science: lowest completion rate in the school at 64%.",
  ],
  actions: [
    "Schedule a cross-class fractions clinic for Grade 8 before the next unit test.",
    "Pair Class 8B with a Science teacher mentor for a shared lesson on balanced forces.",
    "Review assessment timing in Class 7A — low completion may reflect scheduling, not ability.",
  ],
};

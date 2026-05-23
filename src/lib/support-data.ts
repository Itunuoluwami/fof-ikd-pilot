// Mock support-specific data: tasks, programme guide progress, etc.
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface SupportTask {
  id: string;
  supportId: string;
  title: string;
  time: string;          // "07:00"
  location: string;
  priority: TaskPriority;
  status: TaskStatus;
  date: string;          // ISO date
  completedAt?: string;
  completedBy?: string;
}

export const supportTasks: SupportTask[] = [
  // Week of May 12, 2025 (Mon-Sun)
  { id: "t-1", supportId: "u-3", title: "Morning Prayer Setup", time: "07:00", location: "Main Auditorium", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-12" },
  { id: "t-2", supportId: "u-3", title: "Call Andy Cube — Week 4 check-in", time: "10:30", location: "Phone call", priority: "MEDIUM", status: "IN_PROGRESS", date: "2025-05-12" },
  { id: "t-3", supportId: "u-3", title: "Bible Study — Group Alpha", time: "18:00", location: "Sanctuary", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-12" },
  { id: "t-4", supportId: "u-3", title: "Submit weekly prayer log", time: "20:30", location: "App", priority: "LOW", status: "NOT_STARTED", date: "2025-05-12" },
  { id: "t-7", supportId: "u-3", title: "Follow up — Julian Jobb", time: "11:00", location: "Phone call", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-13" },
  { id: "t-8", supportId: "u-3", title: "Cell Group Meeting", time: "18:30", location: "Group Alpha venue", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-13" },
  { id: "t-9", supportId: "u-3", title: "Intercession prep", time: "17:00", location: "Sanctuary", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-14" },
  { id: "t-10", supportId: "u-3", title: "Prayer Meeting attendance", time: "19:00", location: "Sanctuary", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-14" },
  { id: "t-11", supportId: "u-3", title: "Visit Estella Horton", time: "16:00", location: "Off-site", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-15" },
  { id: "t-12", supportId: "u-3", title: "Weekly group report", time: "21:00", location: "App", priority: "LOW", status: "NOT_STARTED", date: "2025-05-16" },
  { id: "t-13", supportId: "u-3", title: "Sunday Service setup", time: "07:30", location: "Main Hall", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-18" },
  // Earlier in May
  { id: "t-14", supportId: "u-3", title: "Group Alpha worship", time: "09:00", location: "Main Hall", priority: "HIGH", status: "DONE", date: "2025-05-04" },
  { id: "t-15", supportId: "u-3", title: "Bible Study — Romans 7", time: "18:00", location: "Sanctuary", priority: "MEDIUM", status: "DONE", date: "2025-05-05" },
  { id: "t-16", supportId: "u-3", title: "Mid-week intercession", time: "19:00", location: "Sanctuary", priority: "MEDIUM", status: "DONE", date: "2025-05-07" },
  // Later in May
  { id: "t-17", supportId: "u-3", title: "Week 5 launch briefing", time: "10:00", location: "Online", priority: "HIGH", status: "NOT_STARTED", date: "2025-05-20" },
  { id: "t-18", supportId: "u-3", title: "Faith project review", time: "15:00", location: "Hall B", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-22" },
  { id: "t-19", supportId: "u-3", title: "Group dinner", time: "18:00", location: "Off-site", priority: "LOW", status: "NOT_STARTED", date: "2025-05-24" },
  { id: "t-20", supportId: "u-3", title: "Monthly retrospective", time: "20:00", location: "Online", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-30" },
  // Other supports
  { id: "t-5", supportId: "u-4", title: "Group Beta worship setup", time: "06:45", location: "Main Hall", priority: "HIGH", status: "DONE", date: "2025-05-12", completedAt: "2025-05-12T06:50:00Z", completedBy: "u-4" },
  { id: "t-6", supportId: "u-4", title: "Follow up with Russell McCarthy", time: "12:00", location: "Phone call", priority: "MEDIUM", status: "NOT_STARTED", date: "2025-05-12" },
];

export interface ProgrammeGuideSection {
  id: string; week: number; title: string; progress: number; lastSection: string;
}

export const programmeGuide: ProgrammeGuideSection[] = [
  { id: "pg-1", week: 4, title: "Week 4 — Support Expectations", progress: 70, lastSection: "Section 3: Pastoral Care Touchpoints" },
];

export interface SupportNote {
  id: string; participantId: string; supportId: string; date: string; text: string;
}
export const supportNotes: SupportNote[] = [
  { id: "n-1", participantId: "p-1", supportId: "u-3", date: "2025-05-07", text: "Follow-up call completed. Andy in good spirits, prepping for week 5." },
  { id: "n-2", participantId: "p-2", supportId: "u-3", date: "2025-05-09", text: "Julian missed bible study. Reached out via WhatsApp." },
];

export const priorityTone: Record<TaskPriority, "danger" | "warning" | "neutral"> = {
  HIGH: "danger", MEDIUM: "warning", LOW: "neutral",
};

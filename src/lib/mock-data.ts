// Mock data for FOF IKD Ops admin module.
// Replace with Supabase queries when backend is wired up.

export type UserRole = "ADMIN" | "SOP_PREPARER" | "SUPPORT";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type ActivityStatus = "SCHEDULED" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type PrayerStatus = "OPEN" | "IN_PROGRESS" | "ANSWERED";
export type WeekStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ChangeStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CohortStatus = "ONGOING" | "COMPLETED";
export interface Cohort { id: string; name: string; startDate: string; participantCount: number; groupCount: number; status: CohortStatus; }
export interface Group { id: string; name: string; cohortId: string; supportIds: string[]; participantIds: string[]; }
export interface User { id: string; name: string; role: UserRole; status: UserStatus; phone?: string; email?: string; cohortId?: string; groupId?: string; avatarColor: string; }
export interface Participant { id: string; name: string; phone: string; cohortId: string; groupId: string; supportId?: string; joinedAt: string; notes?: string; avatarColor: string; }
export interface Activity { id: string; title: string; description: string; startTime: string; endTime: string; location: string; teams: string[]; status: ActivityStatus; }
export interface Day { id: string; name: string; date: string; activities: Activity[]; }
export interface Week { id: string; number: number; title: string; cohortId: string; status: WeekStatus; days: Day[]; }
export interface PendingChange { id: string; activityId: string; activityTitle: string; submittedBy: string; submittedAt: string; status: ChangeStatus; before: Partial<Activity>; after: Partial<Activity>; note?: string; }
export interface PrayerRequest { id: string; participantId: string; submittedById: string; text: string; date: string; status: PrayerStatus; }
export interface AttendanceRecord { id: string; participantId: string; activityId: string; weekId: string; status: AttendanceStatus; date: string; }
export interface Announcement { id: string; title: string; body: string; pinned: boolean; urgent: boolean; createdAt: string; expiresAt?: string; }
export interface Resource { id: string; title: string; category: string; type: "PDF" | "VIDEO" | "LINK" | "DOC"; addedAt: string; isNew: boolean; description: string; avatarColor: string; }

const colors = ["#FF914D", "#E5822D", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#1a1a2e"];
const c = (i: number) => colors[i % colors.length];

export const cohorts: Cohort[] = [
  { id: "co-1", name: "Cohort 2025-A", startDate: "2025-01-12", participantCount: 48, groupCount: 6, status: "ONGOING" },
  { id: "co-2", name: "Cohort 2024-B", startDate: "2024-04-06", participantCount: 36, groupCount: 5, status: "COMPLETED" },
  { id: "co-3", name: "Cohort 2024-C", startDate: "2024-09-15", participantCount: 52, groupCount: 7, status: "COMPLETED" },
];

export const users: User[] = [
  { id: "u-1", name: "Stas Adebayo", role: "ADMIN", status: "ACTIVE", email: "stas@tcnikd.org", avatarColor: c(0) },
  { id: "u-2", name: "Grace Olufemi", role: "SOP_PREPARER", status: "ACTIVE", email: "grace@tcnikd.org", avatarColor: c(1) },
  { id: "u-3", name: "Daniel Okeke", role: "SUPPORT", status: "ACTIVE", cohortId: "co-1", groupId: "g-1", avatarColor: c(2) },
  { id: "u-4", name: "Esther Bello", role: "SUPPORT", status: "ACTIVE", cohortId: "co-1", groupId: "g-2", avatarColor: c(3) },
  { id: "u-5", name: "Samuel Ajayi", role: "SUPPORT", status: "ACTIVE", cohortId: "co-2", groupId: "g-3", avatarColor: c(4) },
  { id: "u-6", name: "Ruth Eze", role: "SUPPORT", status: "INACTIVE", cohortId: "co-3", avatarColor: c(5) },
  { id: "u-7", name: "Michael Adekunle", role: "SOP_PREPARER", status: "ACTIVE", avatarColor: c(6) },
];

export const groups: Group[] = [
  { id: "g-1", name: "Group Alpha", cohortId: "co-1", supportIds: ["u-3"], participantIds: ["p-1", "p-2"] },
  { id: "g-2", name: "Group Beta", cohortId: "co-1", supportIds: ["u-4"], participantIds: ["p-3", "p-4"] },
  { id: "g-3", name: "Group Gamma", cohortId: "co-2", supportIds: ["u-5"], participantIds: ["p-5"] },
];

export const participants: Participant[] = [
  { id: "p-1", name: "Andy Cube", phone: "+2348012345671", cohortId: "co-1", groupId: "g-1", supportId: "u-3", joinedAt: "2025-01-12", avatarColor: c(0) },
  { id: "p-2", name: "Julian Jobb", phone: "+2348012345672", cohortId: "co-1", groupId: "g-1", supportId: "u-3", joinedAt: "2025-01-12", avatarColor: c(1) },
  { id: "p-3", name: "Russell McCarthy", phone: "+2348012345673", cohortId: "co-1", groupId: "g-2", supportId: "u-4", joinedAt: "2025-01-12", avatarColor: c(2) },
  { id: "p-4", name: "John Jonson", phone: "+2348012345674", cohortId: "co-1", groupId: "g-2", supportId: "u-4", joinedAt: "2025-01-12", avatarColor: c(3) },
  { id: "p-5", name: "Larry McGee", phone: "+2348012345675", cohortId: "co-2", groupId: "g-3", supportId: "u-5", joinedAt: "2025-04-06", avatarColor: c(4) },
  { id: "p-6", name: "Dominic Ain", phone: "+2348012345676", cohortId: "co-2", groupId: "g-3", supportId: "u-5", joinedAt: "2025-04-06", avatarColor: c(5) },
  { id: "p-7", name: "Estella Horton", phone: "+2348012345677", cohortId: "co-1", groupId: "g-1", supportId: "u-3", joinedAt: "2025-01-12", avatarColor: c(6) },
  { id: "p-8", name: "Dominic Dain", phone: "+2348012345678", cohortId: "co-1", groupId: "g-2", supportId: "u-4", joinedAt: "2025-01-12", avatarColor: c(7) },
];

export const weeks: Week[] = [
  {
    id: "w-1", number: 4, title: "Week 4 — Faith in Action", cohortId: "co-1", status: "PUBLISHED",
    days: [
      { id: "d-1", name: "Day 1 — Monday", date: "2025-05-12", activities: [
        { id: "a-1", title: "Morning Devotion", description: "Group prayer & worship", startTime: "06:30", endTime: "07:15", location: "Main Hall", teams: ["Worship"], status: "DONE" },
        { id: "a-2", title: "Bible Study: Romans 8", description: "Led by Pastor M.", startTime: "18:00", endTime: "19:30", location: "Sanctuary", teams: ["Teaching"], status: "DONE" },
      ]},
      { id: "d-2", name: "Day 2 — Tuesday", date: "2025-05-13", activities: [
        { id: "a-3", title: "Cell Group Meeting", description: "Small group discussion", startTime: "18:30", endTime: "20:00", location: "Various", teams: ["Support"], status: "IN_PROGRESS" },
      ]},
      { id: "d-3", name: "Day 3 — Wednesday", date: "2025-05-14", activities: [
        { id: "a-4", title: "Prayer Meeting", description: "Corporate intercession", startTime: "19:00", endTime: "20:30", location: "Sanctuary", teams: ["Prayer"], status: "SCHEDULED" },
      ]},
    ],
  },
  { id: "w-2", number: 5, title: "Week 5 — Walking by the Spirit", cohortId: "co-1", status: "DRAFT", days: [] },
];

export const pendingChanges: PendingChange[] = [
  { id: "pc-1", activityId: "a-4", activityTitle: "Prayer Meeting", submittedBy: "Grace Olufemi", submittedAt: "2025-05-11T14:32:00Z", status: "PENDING",
    before: { startTime: "19:00", endTime: "20:30", location: "Sanctuary" },
    after: { startTime: "19:30", endTime: "21:00", location: "Main Hall" } },
  { id: "pc-2", activityId: "a-3", activityTitle: "Cell Group Meeting", submittedBy: "Michael Adekunle", submittedAt: "2025-05-11T10:14:00Z", status: "PENDING",
    before: { description: "Small group discussion" },
    after: { description: "Small group discussion + worship session" } },
];

export const prayerRequests: PrayerRequest[] = [
  { id: "pr-1", participantId: "p-1", submittedById: "u-3", text: "Pray for clarity on career direction.", date: "2025-05-08", status: "OPEN" },
  { id: "pr-2", participantId: "p-3", submittedById: "u-4", text: "Healing for my mother who is recovering from surgery.", date: "2025-05-09", status: "IN_PROGRESS" },
  { id: "pr-3", participantId: "p-5", submittedById: "u-5", text: "Thanksgiving for new job opportunity!", date: "2025-05-05", status: "ANSWERED" },
  { id: "pr-4", participantId: "p-7", submittedById: "u-3", text: "Strength to forgive a long-standing offense.", date: "2025-05-10", status: "OPEN" },
];

export const attendance: AttendanceRecord[] = [
  { id: "at-1", participantId: "p-1", activityId: "a-1", weekId: "w-1", status: "PRESENT", date: "2025-05-12" },
  { id: "at-2", participantId: "p-2", activityId: "a-1", weekId: "w-1", status: "PRESENT", date: "2025-05-12" },
  { id: "at-3", participantId: "p-3", activityId: "a-1", weekId: "w-1", status: "LATE", date: "2025-05-12" },
  { id: "at-4", participantId: "p-4", activityId: "a-1", weekId: "w-1", status: "ABSENT", date: "2025-05-12" },
  { id: "at-5", participantId: "p-1", activityId: "a-2", weekId: "w-1", status: "PRESENT", date: "2025-05-12" },
  { id: "at-6", participantId: "p-2", activityId: "a-2", weekId: "w-1", status: "EXCUSED", date: "2025-05-12" },
  { id: "at-7", participantId: "p-3", activityId: "a-2", weekId: "w-1", status: "PRESENT", date: "2025-05-12" },
];

export const announcements: Announcement[] = [
  { id: "an-1", title: "Week 5 Schedule Published", body: "The new week schedule is now live. Please review your cohort activities.", pinned: true, urgent: false, createdAt: "2025-05-11T09:00:00Z" },
  { id: "an-2", title: "Emergency: Sunday Service Time Change", body: "This Sunday's service moved to 9:00 AM due to community event.", pinned: false, urgent: true, createdAt: "2025-05-10T16:00:00Z", expiresAt: "2025-05-18" },
];

export const resources: Resource[] = [
  { id: "r-1", title: "FOF Curriculum Vol. 1", category: "Curriculum", type: "PDF", addedAt: "2025-01-10", isNew: false, description: "Foundation of Faith core teaching", avatarColor: c(0) },
  { id: "r-2", title: "Discipleship Handbook", category: "Curriculum", type: "PDF", addedAt: "2025-02-20", isNew: false, description: "Reference manual for supports", avatarColor: c(1) },
  { id: "r-3", title: "Worship Track — Higher", category: "Worship", type: "VIDEO", addedAt: "2025-05-01", isNew: true, description: "Original worship track", avatarColor: c(2) },
  { id: "r-4", title: "Prayer Guide May 2025", category: "Prayer", type: "DOC", addedAt: "2025-05-05", isNew: true, description: "Monthly intercession guide", avatarColor: c(3) },
  { id: "r-5", title: "Onboarding Checklist", category: "Operations", type: "DOC", addedAt: "2025-03-12", isNew: false, description: "Participant onboarding flow", avatarColor: c(4) },
  { id: "r-6", title: "Testimony — Larry M.", category: "Testimonies", type: "VIDEO", addedAt: "2025-04-22", isNew: false, description: "Personal walk testimony", avatarColor: c(5) },
  { id: "r-7", title: "Romans Study Notes", category: "Bible Study", type: "PDF", addedAt: "2025-05-08", isNew: true, description: "Verse-by-verse notes", avatarColor: c(6) },
  { id: "r-8", title: "TCN Doctrine Statement", category: "Reference", type: "LINK", addedAt: "2024-12-01", isNew: false, description: "Official doctrine reference", avatarColor: c(7) },
];

// Helpers
export const getParticipant = (id: string) => participants.find(p => p.id === id);
export const getUser = (id: string) => users.find(u => u.id === id);
export const getCohort = (id: string) => cohorts.find(c => c.id === id);
export const getGroup = (id: string) => groups.find(g => g.id === id);
export const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

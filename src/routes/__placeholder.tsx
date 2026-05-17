import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Avatar, StatusBadge } from "@/components/Primitives";
import { announcements, attendance, cohorts, getParticipant, participants, pendingChanges, prayerRequests, users, weeks, groups } from "@/lib/mock-data";
import { useSelectedCohortId } from "@/lib/store";
import { Users, UserCircle2, Network, Layers, CalendarPlus, Megaphone, FolderPlus, UserPlus, BarChart3, Plus, AlertCircle, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/__placeholder")({
  component: () => <AppShell />,
});

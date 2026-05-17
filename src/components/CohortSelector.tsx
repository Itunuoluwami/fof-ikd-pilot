import { ChevronDown } from "lucide-react";
import { cohorts } from "@/lib/mock-data";
import { setSelectedCohortId, useSelectedCohortId } from "@/lib/store";

export function CohortSelector() {
  const selected = useSelectedCohortId();
  return (
    <label className="inline-flex items-center gap-2 bg-muted/60 hover:bg-muted px-3 py-2 rounded-xl cursor-pointer">
      <span className="text-xs text-muted-foreground hidden sm:inline">You work on:</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelectedCohortId(e.target.value)}
          className="appearance-none bg-transparent pr-6 text-sm font-semibold text-primary focus:outline-none cursor-pointer"
        >
          {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </label>
  );
}

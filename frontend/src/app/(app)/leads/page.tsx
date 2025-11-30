import { KanbanBoard } from "@/components/leads/kanban-board";
import { NewLeadButton } from "@/components/leads/new-lead-button";

export const metadata = {
  title: "Leads | Desencontro CRM",
};

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">Leads</h1>
        <NewLeadButton />
      </div>
      <KanbanBoard />
    </div>
  );
}

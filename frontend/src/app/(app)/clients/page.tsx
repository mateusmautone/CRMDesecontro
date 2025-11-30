import { ClientList } from "@/components/clients/client-list";
import { NewClientButton } from "@/components/clients/new-client-button";
import { useState } from "react";
import type { Client } from "@/lib/types";

export const metadata = {
  title: "Clientes | Desencontro CRM",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  // O ClientList mantém seu próprio estado; passamos callback para adicionar recém criado se necessário.
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewClientButton
          onCreated={(c) => {
            // best-effort: não interfere se ClientList já tiver carregado; evento poderia ser propagado via contexto em futura refatoração
            setClients((prev) => [c, ...prev]);
            // ideal futuro: levantar estado para consolidar origem única
          }}
        />
      </div>
      <ClientList />
    </div>
  );
}

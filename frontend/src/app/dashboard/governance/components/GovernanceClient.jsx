"use client";

import { useState } from "react";
import { AddGovernanceForm } from "./AddGovernanceForm";
import { GovernanceDataTable } from "./data_table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function GovernanceClient({ initialData }) {
  const [records, setRecords] = useState(initialData || []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4">
        <AddGovernanceForm/>
      </div>
      <GovernanceDataTable data={records} />
    </div>
  );
}

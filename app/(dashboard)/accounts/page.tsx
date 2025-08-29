"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "@/components/ui/data-table";


const data : Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 500,
      status: "success",
      email: "a@example.com",
    },
];


export default function AccountsPage() {
    const newAccount = useNewAccount();
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">
                Accounts page
                </CardTitle>
                <Button onClick={newAccount.onOpen} size="sm">
                    <Plus className="size-4 mr-2"/>
                    Add new
                </Button>
            </CardHeader>
            <CardContent>
                <DataTable
                onDelete={()=>{}} 
                filterKey="email"
                columns={columns} data={data}/>
            </CardContent>
        </Card>
    </div>
  )
}

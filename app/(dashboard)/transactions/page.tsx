"use client";
import { Loader2, Plus } from "lucide-react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransaction } from "@/features/transactions/api/use-bulk-delete-transactions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { columns } from "./columns";

export default function TransactionPage() {

    const newTransaction = useNewTransaction();
    const transactionQuery = useGetTransactions();
    const deleteTransaction = useBulkDeleteTransaction();
    const transaction = transactionQuery.data || [];

    const isDisabled = transactionQuery.isLoading || deleteTransaction.isPending;

    if(transactionQuery.isLoading){
      return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48"/>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin"/>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">
                Transactions History
                </CardTitle>
                <Button onClick={newTransaction.onOpen} size="sm">
                    <Plus className="size-4 mr-2"/>
                    Add new
                </Button>
            </CardHeader>
            <CardContent>
                <DataTable
                onDelete={(row)=>{
                  const ids = row.map((r) => r.original.id);
                  deleteTransaction.mutate({ids});
                }} 
                filterKey="name"
                columns={columns} 
                data={transaction}
                disabled={isDisabled}/>
            </CardContent>
        </Card>
    </div>
  )
}

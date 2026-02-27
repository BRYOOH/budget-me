"use client";
import { Loader2, Plus } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransaction } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransaction } from "@/features/transactions/api/use-bulk-create-transactions";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { transactions as transactionsSchema } from "@/database/schema";

import { columns } from "./columns";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import ImportCard from "./import-card";
import { toast } from "sonner";

enum VARIANTS {
    LIST = "list",
    IMPORT = "IMPORT",
};

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors:[],
  meta: {},
};

export default function TransactionPage() {

    const [AccountDialog,confirm] = useSelectAccount();
    const [variant,setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [ importResults, setImportResults] = useState<typeof INITIAL_IMPORT_RESULTS>(INITIAL_IMPORT_RESULTS);
    
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
      setImportResults(results);
      setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
      setImportResults(INITIAL_IMPORT_RESULTS);
      setVariant(VARIANTS.LIST);
    };

    const newTransaction = useNewTransaction();
    const transactionQuery = useGetTransactions();
    const deleteTransaction = useBulkDeleteTransaction();
    const createTransactions = useBulkCreateTransaction()
    const transaction = transactionQuery.data || [];
    
    const isDisabled = transactionQuery.isLoading || deleteTransaction.isPending;
    
    const onSubmitImport = async ( //Receives validated imported transactions and saves them to the database
          values: typeof transactionsSchema.$inferInsert[],
    ) => {
      const accountId = await confirm(); // Requests the account from the user 
      
      if(!accountId){
        return toast.error("Please select an account to continue");
      };

      // Used to attach accountId to every imported transaction
      const data = values.map((value)=>{

        return {
        ...value,
        accountId: accountId as string,
        }

      });

      createTransactions.mutate(data, {
        onSuccess: () =>{
          onCancelImport();
        },
      });
    };

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

    if(variant === VARIANTS.IMPORT){
      return (
        <>
        <AccountDialog/>
        <ImportCard 
        data = {importResults.data}
        onCancel={onCancelImport}
        onSubmit={onSubmitImport}
        />
        </>
      )}

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">
                Transactions History
                </CardTitle>
                <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2 w-full">
                <Button
                className="w-full lg:w-auto"
                onClick={newTransaction.onOpen}
                size="sm"
                >
                    <Plus className="size-4 mr-2"/>
                    Add new
                </Button>
                <UploadButton onUpload={onUpload}/>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                onDelete={(row)=>{
                  const ids = row.map((r) => r.original.id);
                  deleteTransaction.mutate({ids});
                }} 
                filterKey="payee"
                columns={columns} 
                data={transaction}
                disabled={isDisabled}/>
            </CardContent>
        </Card>
    </div>
  )
}


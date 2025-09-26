/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Sheet,SheetContent,
    SheetDescription, 
    SheetHeader, 
    SheetTitle
} from "@/components/ui/sheet"
import { useOpenAccount } from "../hooks/use-open-account";
import { useCreateAccount } from "../api/use-create-accounts";
import { useGetAccount } from "../api/use-get-account";

import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/database/schema";
import { z } from "zod/v4";

const formSchema = insertAccountSchema.pick({name:true});
type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () =>{
    const { isOpen, onClose,id } = useOpenAccount();

    const accountQuery = useGetAccount(id);
    const mutation = useCreateAccount();
   
    const onSubmit = ( values : FormValues) => {
       mutation.mutate(values, {
        onSuccess: () =>{
        onClose();
            },
        }); 
    };

     const defaultValues = accountQuery.data ? {
        name:accountQuery.data.name
     }: {
        name: ""
     };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                    New Account
                    </SheetTitle>
                    <SheetDescription>
                    Create a new account to track your transcations. 
                    </SheetDescription>
                </SheetHeader>
                <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={defaultValues}/>
            </SheetContent>
        </Sheet>
    )
}
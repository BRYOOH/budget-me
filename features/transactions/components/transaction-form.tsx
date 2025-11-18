/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod/v4";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { Select } from "@/app/components/select";
import { DatePicker } from "@/app/components/date-picker";
import { insertTransactionsSchema } from "@/database/schema";

import { Button } from "@/components/ui/button";
import { AmountInput } from "@/app/components/amount-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertAmountToMilliUnits } from "@/lib/utils";

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionsSchema.omit({
    id:true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label:string; value:string;}[];
    categoryOptions: { label:string; value:string;}[];
    onCreateAccount: (name:string)=> void;
    onCreateCategory: (name:string)=> void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory,
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: FormValues) =>{
        const amount = parseFloat(values.amount);
        const amountInMilliunits = convertAmountToMilliUnits(amount);
        onSubmit({
            ...values,
            amount: amountInMilliunits,
        });
    }; 
     
    const handleDelete = () =>{
        onDelete?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField name="date" 
                control={form.control} 
                render={({ field}) => (
                    <FormItem>
                        <FormControl>
                            <DatePicker
                            value={field.value as Date | undefined}
                            onChange={field.onChange}
                            disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                <FormField name="accountId" 
                control={form.control} 
                render={({ field}) => (
                    <FormItem>
                        <FormLabel> 
                            Account 
                        </FormLabel>
                        <FormControl>
                            <Select
                            placeholder="Select an account"
                            options={accountOptions}
                            onCreate={onCreateAccount}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                <FormField name="categoryId" 
                control={form.control} 
                render={({ field}) => (
                    <FormItem>
                        <FormLabel> 
                            Category
                        </FormLabel>
                        <FormControl>
                            <Select
                            placeholder="Select a category"
                            options={categoryOptions}
                            onCreate={onCreateCategory}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                 <FormField name="payee" 
                control={form.control} 
                render={({ field}) => (
                    <FormItem>
                        <FormLabel> 
                           Payee
                        </FormLabel>
                        <FormControl>
                            <Input 
                            disabled={disabled}
                            placeholder="Add a payee"
                            {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                <FormField name="amount" 
                control={form.control} 
                render={({ field}) => (
                    <FormItem>
                        <FormLabel> 
                            Amount
                        </FormLabel>
                        <FormControl>
                            <AmountInput 
                            {...field}
                            disabled={disabled}
                            placeholder="0.00"
                            />
                        </FormControl>
                    </FormItem>
                )}/>
                <FormField name="notes" 
                control={form.control} 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> 
                           Payee
                        </FormLabel>
                        <FormControl>
                            <Textarea 
                             {...field}
                             value={ field.value ?? ""}
                            disabled={disabled}
                            placeholder="Optional notes"
                            />
                        </FormControl>
                    </FormItem>
                )}/>
            <Button className="w-full" type="submit">
                { id ? "Save changes" : "Create Transaction"}
            </Button>
            { !!id && <Button type="button" 
            disabled={disabled} 
            onClick={handleDelete} 
            className="w-full" 
            variant="outline">
                <Trash className="size-4 mr-2"/>
                Delete Transaction
            </Button>}
            </form>
        </Form>
    )
}
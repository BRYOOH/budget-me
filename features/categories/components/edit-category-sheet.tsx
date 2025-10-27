/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Sheet,SheetContent,
    SheetDescription, 
    SheetHeader, 
    SheetTitle
} from "@/components/ui/sheet"
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";

import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/database/schema";
import { z } from "zod/v4";
import { Loader2 } from "lucide-react";
import { useDeleteCategory } from "../api/use-delete-category";

const formSchema = insertCategorySchema.pick({name:true});
type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () =>{
    const { isOpen, onClose,id } = useOpenCategory();

    const CategoryQuery = useGetCategory(id);
    const mutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending  = mutation.isPending || deleteMutation.isPending ;
    const isLoading = CategoryQuery.isLoading;
   
    const onSubmit = ( values : FormValues) => {
       mutation.mutate(values, {
        onSuccess: () =>{
        onClose();
            },
        }); 
    };

     const defaultValues = CategoryQuery.data ? {
        name:CategoryQuery.data.name
     }: {
        name: ""
     };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                    Edit Category
                    </SheetTitle>
                    <SheetDescription>
                    Edit an existing Category
                    </SheetDescription>
                </SheetHeader>
                {isLoading ?
                (<div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                </div>): 
                <CategoryForm 
                id={id}
                onSubmit={onSubmit} 
                disabled={isPending} 
                defaultValues={defaultValues}
                onDelete={ () => deleteMutation.mutate()}
                /> }
                
            </SheetContent>
        </Sheet>
    )
}
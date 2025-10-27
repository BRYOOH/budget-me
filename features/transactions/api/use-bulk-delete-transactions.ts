import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType <typeof client.api.transactions["bulk-delete"]["$post"]> ["json"];
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;

export const useBulkDeleteTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({ json });
            return await response.json();
        },onSuccess: () =>{
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
            //TODO: Also invalidate summarymn
        },onError: () =>{
            toast.error("Failed to delete transactions");
        }
    });

    return mutation;
};

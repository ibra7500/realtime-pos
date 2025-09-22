import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteTable } from "../actions";
import { toast } from "sonner";
import { Table } from "@/validations/table-validation";

export default function DialogDeleteTable({
    refetch,
    currentData,
    open,
    handleChangeAction,
}: {
    refetch: () => void;
    currentData?: Table;
    open?: boolean;
    handleChangeAction?: (open: boolean) => void;
}) {
    const [title, setTitle] = useState<string>("");

    const [deleteTableState, deleteTableAction, isPendingDeleteTable] =
        useActionState(deleteTable, INITIAL_STATE_ACTION);

    const onSubmit = () => {
        const formData = new FormData();
        formData.append("id", currentData!.id as string);
        startTransition(() => {
            deleteTableAction(formData);
        });
    };

    useEffect(() => {
        if (open) {
            setTitle(currentData?.name ?? ""); // safe fallback
        }
    }, [open]);
    
    useEffect(() => {
        if (deleteTableState?.status === "error") {
            toast.error("Delete Failed", {
                description: deleteTableState.errors?._form?.[0],
            });
        }

        if (deleteTableState.status === "success") {
            toast.success("Delete table success!");
            handleChangeAction?.(false);
            refetch();
        }
    }, [deleteTableState]);

    return (
        <DialogDelete
            open={open}
            onOpenChange={handleChangeAction}
            isLoading={isPendingDeleteTable}
            onSubmit={onSubmit}
            title={title}
        />
    );
}

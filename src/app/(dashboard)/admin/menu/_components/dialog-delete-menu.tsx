import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteMenu } from "../actions";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";

export default function DialogDeleteMenu({
    refetch,
    currentData,
    open,
    handleChangeAction,
}: {
    refetch: () => void;
    currentData?: Menu;
    open?: boolean;
    handleChangeAction?: (open: boolean) => void;
}) {
    const [title, setTitle] = useState<string>("");

    const [deleteMenuState, deleteMenuAction, isPendingDeleteMenu] =
        useActionState(deleteMenu, INITIAL_STATE_ACTION);

    const onSubmit = () => {
        const formData = new FormData();
        formData.append("id", currentData!.id as string);
        formData.append("image_url", currentData!.image_url as string);

        startTransition(() => {
            deleteMenuAction(formData);
        });
    };

    useEffect(() => {
        if (open) {
            setTitle(currentData?.name ?? ""); // safe fallback
        }
    }, [open]);

    useEffect(() => {
        if (deleteMenuState?.status === "error") {
            toast.error("Delete Failed", {
                description: deleteMenuState.errors?._form?.[0],
            });
        }

        if (deleteMenuState.status === "success") {
            toast.success("Delete menu success!");
            handleChangeAction?.(false);
            refetch();
        }
    }, [deleteMenuState]);

    return (
        <DialogDelete
            open={open}
            onOpenChange={handleChangeAction}
            isLoading={isPendingDeleteMenu}
            onSubmit={onSubmit}
            title={title}
        />
    );
}

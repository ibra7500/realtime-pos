import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteUser } from "../actions";
import { toast } from "sonner";
import { Profile } from "@/types/auth";

export default function DialogDeleteUser({
    refetch,
    currentData,
    open,
    handleChangeAction,
}: {
    refetch: () => void;
    currentData?: Profile;
    open?: boolean;
    handleChangeAction?: (open: boolean) => void;
}) {
    const [title, setTitle] = useState<string>("");

    const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
        useActionState(deleteUser, INITIAL_STATE_ACTION);

    const onSubmit = () => {
        const formData = new FormData();
        formData.append("id", currentData!.id as string);
        formData.append("avatar_url", currentData!.avatar_url as string);

        startTransition(() => {
            deleteUserAction(formData);
        });
    };

    useEffect(() => {
        if (open) {
            setTitle(currentData?.name ?? ""); // safe fallback
        }
    }, [open]);

    useEffect(() => {
        if (deleteUserState?.status === "error") {
            toast.error("Delete Failed", {
                description: deleteUserState.errors?._form?.[0],
            });
        }

        if (deleteUserState.status === "success") {
            toast.success("Delete user success!");
            handleChangeAction?.(false);
            refetch();
        }
    }, [deleteUserState]);

    return (
        <DialogDelete
            open={open}
            onOpenChange={handleChangeAction}
            isLoading={isPendingDeleteUser}
            onSubmit={onSubmit}
            title={title}
        />
    );
}

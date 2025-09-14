import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { startTransition, useActionState, useEffect } from "react";
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
        if (deleteUserState?.status === "error") {
            toast.error("Login Failed", {
                description: deleteUserState.errors?._form?.[0],
            });
        }

        if (deleteUserState.status === "success") {
            toast.success("Create user success!");
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
            title="User"
        />
    );
}

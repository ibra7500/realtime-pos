import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
    INITIAL_CREATE_USER_FORM,
    INITIAL_STATE_CREATE_USER,
    ROLE_LIST,
} from "@/constants/auth-constant";
import {
    CreateUserForm,
    createUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUser } from "../actions";
import { toast } from "sonner";
import FormSelect from "@/components/common/form-select";
import FormImage from "@/components/common/form-image";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
    const form = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema),
        defaultValues: INITIAL_CREATE_USER_FORM,
    });

    const [createUserState, createUserAction, isPendingCreateUser] =
        useActionState(createUser, INITIAL_STATE_CREATE_USER);

    const [preview, setPreview] = useState<
        { file: File; displayUrl: string } | undefined
    >(undefined);

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, key === 'avatar_url' ? preview!.file ?? '' : value);
        });
        startTransition(() => {
            createUserAction(formData);
        });
    });

    useEffect(() => {
        if (createUserState?.status === "error") {
            toast.error("Login Failed", {
                description: createUserState.errors?._form?.[0],
            });
        }

        if (createUserState.status === "success") {
            toast.success("Create user success!");
            form.reset();
            setPreview(undefined);
            document
                .querySelector<HTMLButtonElement>('[data-state="open"]')
                ?.click();
            refetch();
        }
    }, [createUserState]);

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>Create a new user</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                    <FormInput
                        form={form}
                        name="name"
                        label="Name"
                        placeholder="Insert Name here"
                    />
                    <FormInput
                        form={form}
                        name="email"
                        label="Email"
                        placeholder="Insert email here"
                        type="email"
                    />
                    <FormSelect
                        form={form}
                        name="role"
                        label="Role"
                        selectItem={ROLE_LIST}
                    />
                    <FormInput
                        form={form}
                        name="password"
                        label="Password"
                        placeholder="Insert password here"
                        type="password"
                    />
                    <FormImage
                        form={form}
                        name="avatar_url"
                        label="Avatar"
                        preview={preview}
                        setPreview={setPreview}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">
                            {isPendingCreateUser ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

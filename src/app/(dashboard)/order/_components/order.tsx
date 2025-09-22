"use client";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import { useMemo, useState } from "react";
import DropdownAction from "@/components/common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import useDataTable from "@/hooks/use-data-table";
// import DialogCreateUser from "./dialog-create-user";
import { Profile } from "@/types/auth";
import { Table } from "@/validations/table-validation";
import { HEADER_TABLE_ORDER } from "@/constants/order-constant";
import { cn } from "@/lib/utils";
// import DialogUpdateUser from "./dialog-update-user";
// import DialogDeleteUser from "./dialog-delete-user";

export default function OrderManagement() {
    const supabase = createClient();
    const {
        currentPage,
        currentLimit,
        currentSearch,
        handleChangePage,
        handleChangeLimit,
        handleChangeSearch,
    } = useDataTable();

    const {
        data: orders,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["orders", currentPage, currentLimit, currentSearch],
        queryFn: async () => {
            const query = supabase
                .from("orders")
                .select(
                    `id, order_id, customer_name, status, payment_url, tables (name, id)`,
                    { count: "exact" }
                )
                .range(
                    (currentPage - 1) * currentLimit,
                    currentPage * currentLimit - 1
                )
                .order("created_at");

            if (currentSearch) {
                query.or(
                    `order_id.ilike.%${currentSearch}%,customer_name.ilike.%${currentSearch}%`
                );
            }

            const result = await query;

            if (result.error)
                toast.error("Gagal mengambil data order", {
                    description: result.error.message,
                });

            return result;
        },
    });

    const [selectedAction, setSelectedAction] = useState<{
        data: Table;
        type: "update" | "delete";
    } | null>(null);

    const filteredData = useMemo(() => {
        return (orders?.data || []).map((order, index) => {
            return [
                currentLimit * (currentPage - 1) + index + 1,
                order.order_id,
                // order.order_id,
                order.customer_name,
                (order.tables as unknown as { name: string }).name,
                <div
                    className={cn(
                        "capitalize px-2 py-1 rounded-full text-white w-fit",
                        {
                            "bg-lime-600": order.status === "settled",
                            "bg-sky-600": order.status === "process",
                            "bg-amber-600": order.status === "reserved",
                            "bg-red-600": order.status === "cancelled",
                        }
                    )}
                >
                    {order.status}
                </div>,
                <DropdownAction menu={[]} />,
            ];
        });
    }, [orders]);

    const totalPages = useMemo(() => {
        return orders && orders.count !== null
            ? Math.ceil(orders.count / currentLimit)
            : 0;
    }, [orders]);

    const handleChangeAction = (open: boolean) => {
        if (!open) setSelectedAction(null);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold">Order Management</h1>

                <div className="flex gap-2">
                    <Input
                        placeholder="Cari Order"
                        onChange={(e) => {
                            handleChangeSearch(e.target.value);
                        }}
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                        {/* <DialogCreateUser refetch={refetch} /> */}
                    </Dialog>
                </div>
            </div>

            <DataTable
                header={HEADER_TABLE_ORDER}
                data={filteredData}
                isLoading={isLoading}
                totalPages={totalPages}
                currentPage={currentPage}
                currentLimit={currentLimit}
                onChangePage={handleChangePage}
                onChangeLimit={handleChangeLimit}
            />
            {/* <DialogUpdateUser
                open={
                    selectedAction !== null && selectedAction.type === "update"
                }
                refetch={refetch}
                currentData={selectedAction?.data}
                handleChangeAction={handleChangeAction}
            />
            <DialogDeleteUser
                open={
                    selectedAction !== null && selectedAction.type === "delete"
                }
                refetch={refetch}
                currentData={selectedAction?.data}
                handleChangeAction={handleChangeAction}
            /> */}
        </div>
    );
}

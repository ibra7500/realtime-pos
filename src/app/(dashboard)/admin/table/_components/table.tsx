"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_MENU } from "@/constants/menu-constant";
// import DialogUpdateMenu from "./dialog-update-menu";
// import DialogDeleteMenu from "./dialog-delete-menu";
import { Table } from "@/validations/table-validation";
import { HEADER_TABLE_TABLE } from "@/constants/table-constant";
import DialogCreateTable from "./dialog-create-table";
import DialogUpdateTable from "./dialog-update-table";
import DialogDeleteTable from "./dialog-delete-table";

export default function TableManagement() {
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
        data: tables,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["tables", currentPage, currentLimit, currentSearch],
        queryFn: async () => {
            const query = supabase
                .from("tables")
                .select("*", { count: "exact" })
                .range(
                    (currentPage - 1) * currentLimit,
                    currentPage * currentLimit - 1
                )
                .order("created_at");

            if (currentSearch) {
                query.or(
                    `name.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`
                );
            }

            const result = await query;

            if (result.error)
                toast.error("Get Table data failed", {
                    description: result.error.message,
                });

            return result;
        },
    });

    const [selectedAction, setSelectedAction] = useState<{
        data: Table;
        type: "update" | "delete";
    } | null>(null);

    const handleChangeAction = (open: boolean) => {
        if (!open) setSelectedAction(null);
    };

    const filteredData = useMemo(() => {
        return (tables?.data || []).map((table: Table, index) => {
            return [
                currentLimit * (currentPage - 1) + index + 1,
                table.name,
                table.description,
                table.capacity,
                <div
                    className={cn(
                        "capitalize px-2 py-1 rounded-full text-white w-fit", {
                            'bg-green-500': table.status === 'available',
                            'bg-red-500': table.status === 'unavailable',
                            'bg-yellow-500': table.status === 'reserved',
                        }
                    )}
                >
                    {table.status}
                </div>,
                <DropdownAction
                    menu={[
                        {
                            label: (
                                <span className="flex item-center gap-2">
                                    <Pencil />
                                    Edit
                                </span>
                            ),
                            action: () => {
                                setSelectedAction({
                                    data: table,
                                    type: "update",
                                });
                            },
                        },
                        {
                            label: (
                                <span className="flex item-center gap-2">
                                    <Trash2 className="text-red-400" />
                                    Delete
                                </span>
                            ),
                            variant: "destructive",
                            action: () => {
                                setSelectedAction({
                                    data: table,
                                    type: "delete",
                                });
                            },
                        },
                    ]}
                />,
            ];
        });
    }, [tables]);

    const totalPages = useMemo(() => {
        return tables && tables.count !== null
            ? Math.ceil(tables.count / currentLimit)
            : 0;
    }, [tables]);

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold">Table Management</h1>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search by name or category"
                        onChange={(e) => handleChangeSearch(e.target.value)}
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                        <DialogCreateTable refetch={refetch} />
                    </Dialog>
                </div>
            </div>
            <DataTable
                header={HEADER_TABLE_TABLE}
                data={filteredData}
                isLoading={isLoading}
                totalPages={totalPages}
                currentPage={currentPage}
                currentLimit={currentLimit}
                onChangePage={handleChangePage}
                onChangeLimit={handleChangeLimit}
            />
            <DialogUpdateTable
                open={
                    selectedAction !== null && selectedAction.type === "update"
                }
                refetch={refetch}
                currentData={selectedAction?.data}
                handleChangeAction={handleChangeAction}
            />
            <DialogDeleteTable
                open={
                    selectedAction !== null && selectedAction.type === "delete"
                }
                refetch={refetch}
                currentData={selectedAction?.data}
                handleChangeAction={handleChangeAction}
            />
        </div>
    );
}

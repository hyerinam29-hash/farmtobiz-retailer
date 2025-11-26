/**
 * @file components/wholesaler/Orders/OrderTable.tsx
 * @description 주문 테이블 컴포넌트
 *
 * TanStack Table을 사용한 주문 목록 테이블입니다.
 *
 * @dependencies
 * - @tanstack/react-table
 * - components/ui/table.tsx
 * - components/wholesaler/Orders/OrderStatusBadge.tsx
 */

"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Eye } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderDetail } from "@/types/order";

interface OrderTableProps {
  orders: OrderDetail[];
  isLoading?: boolean;
}

export default function OrderTable({
  orders,
  isLoading = false,
}: OrderTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<OrderDetail>[] = React.useMemo(
    () => [
      {
        accessorKey: "order_number",
        header: "주문번호",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("order_number")}</div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "주문일",
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          return format(date, "yyyy-MM-dd HH:mm", { locale: ko });
        },
      },
      {
        accessorKey: "product",
        header: "상품명",
        cell: ({ row }) => {
          const product = row.original.product;
          return <div className="font-medium">{product?.name || "-"}</div>;
        },
      },
      {
        accessorKey: "variant",
        header: "옵션",
        cell: ({ row }) => {
          const variant = row.original.variant;
          return <div>{variant?.name || "-"}</div>;
        },
      },
      {
        accessorKey: "quantity",
        header: "수량",
        cell: ({ row }) => {
          return <div className="text-center">{row.getValue("quantity")}</div>;
        },
      },
      {
        accessorKey: "total_amount",
        header: "금액",
        cell: ({ row }) => {
          const amount = row.getValue("total_amount") as number;
          return (
            <div className="text-right font-medium">
              {new Intl.NumberFormat("ko-KR").format(amount)}원
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => {
          return <OrderStatusBadge status={row.getValue("status")} />;
        },
      },
      {
        id: "actions",
        header: "액션",
        cell: ({ row }) => {
          return (
            <Link href={`/wholesaler/orders/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                상세보기
              </Button>
            </Link>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">주문이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as string)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.renderValue() as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          이전
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          다음
        </Button>
      </div>
    </div>
  );
}


/**
 * @file components/wholesaler/MarketPrices/PriceTable.tsx
 * @description 시세 테이블 컴포넌트
 *
 * 시세 데이터를 테이블 형태로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 시세 데이터 테이블 표시
 * 2. 정렬 기능
 * 3. 페이지네이션
 * 4. 데이터 출처 표시
 *
 * @dependencies
 * - @tanstack/react-table (테이블 기능)
 * - components/ui/table
 * - lib/api/market-prices (PriceItem)
 */

"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { PriceItem } from "@/lib/api/market-prices";

interface PriceTableProps {
  data: PriceItem[];
  isLoading?: boolean;
}

export default function PriceTable({ data, isLoading = false }: PriceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 컬럼 정의
  const columns = useMemo<ColumnDef<PriceItem>[]>(
    () => [
      {
        accessorKey: "cfmtnYmd",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2"
            >
              확정일자
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 size-4" />
              ) : (
                <ArrowUpDown className="ml-2 size-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("cfmtnYmd") as string;
          return <div className="font-medium">{date}</div>;
        },
      },
      {
        accessorKey: "lclsfNm",
        header: "대분류",
        cell: ({ row }) => {
          return <div>{row.getValue("lclsfNm") || "-"}</div>;
        },
      },
      {
        accessorKey: "mclsfNm",
        header: "중분류",
        cell: ({ row }) => {
          return <div>{row.getValue("mclsfNm") || "-"}</div>;
        },
      },
      {
        accessorKey: "sclsfNm",
        header: "소분류",
        cell: ({ row }) => {
          return <div>{row.getValue("sclsfNm") || "-"}</div>;
        },
      },
      {
        accessorKey: "avgPrice",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2"
            >
              평균가
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 size-4" />
              ) : (
                <ArrowUpDown className="ml-2 size-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const price = row.getValue("avgPrice") as number;
          return <div className="font-semibold">{formatPrice(price)}원</div>;
        },
      },
      {
        accessorKey: "minPrice",
        header: "최소가",
        cell: ({ row }) => {
          const price = row.getValue("minPrice") as number;
          return <div>{formatPrice(price)}원</div>;
        },
      },
      {
        accessorKey: "maxPrice",
        header: "최고가",
        cell: ({ row }) => {
          const price = row.getValue("maxPrice") as number;
          return <div>{formatPrice(price)}원</div>;
        },
      },
      {
        accessorKey: "source",
        header: "출처",
        cell: ({ row }) => {
          const source = row.getValue("source") as string;
          return (
            <Badge variant="outline" className="text-xs">
              {source === "public" ? "공공 API" : source}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2">
        <div className="text-muted-foreground">시세 데이터가 없습니다.</div>
        <div className="text-sm text-muted-foreground">
          다른 검색 조건을 시도해보세요.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.getCanSort()
                        ? header.renderHeader()
                        : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{cell.renderCell()}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {data.length}개 중 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{" "}
          개 표시
        </div>
        <div className="flex gap-2">
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
    </div>
  );
}


"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
} from "@nextui-org/react";
export default function HP({ data }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(data.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);
    return (
        <>
            <div className="flex gap-5 h-12 justify-center">
                <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">ปั๊มไลค์</p>
            </div>
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="order">ORDER ID</TableColumn>
                    <TableColumn key="user">Email</TableColumn>
                    <TableColumn key="name">รายการ</TableColumn>
                    <TableColumn key="link">ลิงก์</TableColumn>
                    <TableColumn key="charge">ค่าบริการ</TableColumn>
                    <TableColumn key="start_count">เริ่มนับ</TableColumn>
                    <TableColumn key="status">สถานะ</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.order}>
                            <TableCell>{item.order}</TableCell>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="truncate max-w-sm">{item.link}</TableCell>
                            <TableCell>{item.charge}</TableCell>
                            <TableCell>{item.start_count}</TableCell>
                            <TableCell>{item.status}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

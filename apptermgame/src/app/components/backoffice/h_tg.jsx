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
export default function HTG({ data }) {
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
                <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">เติมเกม</p>
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
                    <TableColumn key="transaction_id">ORDER ID</TableColumn>
                    <TableColumn key="user">Email</TableColumn>
                    <TableColumn key="uid">บัญชีที่เติม</TableColumn>
                    <TableColumn key="company_name">เกม</TableColumn>
                    <TableColumn key="desc">รายการ</TableColumn>
                    <TableColumn key="price">ราคา</TableColumn>
                    <TableColumn key="time">เวลา</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.transaction_id}>
                            <TableCell>{item.transaction_id}</TableCell>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>{item.uid}</TableCell>
                            <TableCell>{item.company_id}</TableCell>
                            <TableCell><span dangerouslySetInnerHTML={{ __html: item.desc }} /></TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.time}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

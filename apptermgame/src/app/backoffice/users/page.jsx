'use client'

import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    getKeyValue,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Autocomplete,
    AutocompleteItem,
    Input
} from "@nextui-org/react";
import api from "../../../../ess/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
import copy from "copy-to-clipboard";

export default function Users() {
    const [L, setL] = useState(true)
    const [ONS, setONS] = useState(false)
    const [D, setD] = useState()
    const [ID, setID] = useState()
    const [Permission, setPermission] = useState()
    const [Credit, setCredit] = useState()
    useEffect(() => {
        (async () => {
            if (!L) return;
            fetch()
        })()
    }, [])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const fetch = async () => {
        api.get('backoffice/users', {
            headers: {
                Authorization: Cookies.get("token"),
            },
        })
            .then((result) => {
                setD(result.data)
                setL(false)
            }).catch((err) => {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: 'ไม่สามารถผู้ใช้ได้',
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            });
    }

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user?.avatar }}
                        description={user?.email}
                        name={user?.username}
                    >
                        {user?.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{user?.permission == 0 ? 'ลูกค้า' : user?.permission == 1 ? 'แอดมิน' : user?.permission == 2 && 'เจ้าของ'}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color='success' size="sm" variant="flat">
                        {user?.credit}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        {/* <Tooltip color="warning" content="Edit user"> */}
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { setID(user?._id); setPermission(user?.permission); setCredit(user?.credit); onOpen(); }} >
                            <Icon className={iconClasses} icon="material-symbols:ink-pen" />
                        </span>
                        {/* </Tooltip> */}
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const columns = [
        { name: "ชื่อ", uid: "name" },
        { name: "ระดับ", uid: "role" },
        { name: "เครดิต", uid: "credit" },
        { name: "ACTIONS", uid: "actions" },
    ]
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const submit = async (e) => {
        e.preventDefault()
        setONS(true)
        await api.put('backoffice/users', {
            ID,
            Credit,
            Permission,
        }, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (d) => {
                Swal.fire({
                    title: "สำเร็จ!",
                    text: d.data.msg,
                    icon: "success",
                    confirmButtonColor: '#802eec'
                });
                await fetch()
                onOpenChange(false)
            })
            .catch((e) => {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: e.response?.data.msg || e.message,
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            })
        setONS(false)
    }
    const resetpass = async () => {
        if (!ID) return Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon: "error",
            confirmButtonColor: '#802eec'
        });
        setONS(true)
        await api.post('backoffice/users', {
            ID,
        }, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (d) => {
                copy(d.data.password)
                Swal.fire({
                    title: "สำเร็จ!",
                    text: d.data.msg,
                    icon: "success",
                    confirmButtonColor: '#802eec'
                });
                await fetch()
                onOpenChange(false)
            })
            .catch((e) => {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: e.response?.data.msg || e.message,
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            })
        setONS(false)
    }

    return !L && D && (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">
                    <Table aria-label="Example table with custom cells">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={D}>
                            {(item) => (
                                <TableRow key={item._id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">แก้ไขบัญชีผู้ใช้</ModalHeader>
                                    <ModalBody>
                                        <form className="flex flex-col gap-5" onSubmit={submit}>
                                            <Autocomplete
                                                isRequired
                                                label="ระดับ"
                                                variant="bordered"
                                                selectedKey={String(Permission)}
                                                onSelectionChange={setPermission}
                                                isDisabled={Permission == 2}
                                            >
                                                <AutocompleteItem key='0' value={0}>ผู้ใช้</AutocompleteItem>
                                                <AutocompleteItem key='1' value={1}>แอดมิน</AutocompleteItem>
                                                <AutocompleteItem key='2' value={2}>เจ้าของ</AutocompleteItem>
                                            </Autocomplete>
                                            <Input
                                                isRequired
                                                classNames={{
                                                    base: "-mb-[2px]",
                                                    inputWrapper:
                                                        "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                                }}
                                                label="Credit"
                                                name="credit"
                                                type="text"
                                                variant="bordered"
                                                min={0}
                                                value={Credit}
                                                onChange={(e) => { setCredit(e.target.value) }}
                                            />
                                            <Button type="submit" color="primary" className="w-full" disabled={ONS}>บันทึก</Button>
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                        {Permission !== 2 &&
                                            <Button color="primary" type="button" onClick={() => resetpass()}>
                                                Reset Password
                                            </Button>
                                        }
                                        <Button color="danger" variant="light" type="button" onPress={onClose}>
                                            ปิด
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </main>
        </>
    );
}

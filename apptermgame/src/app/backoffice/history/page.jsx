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
import HTG from "@/app/components/backoffice/h_tg";
import HA from "@/app/components/backoffice/ha";
import HU from "@/app/components/backoffice/hu";
import HP from "@/app/components/backoffice/hp";

export default function Users() {
    const [L, setL] = useState(true)
    const [D, setD] = useState()
    useEffect(() => {
        (async () => {
            if (!L) return;
            fetch()
        })()
    }, [])

    const fetch = async () => {
        api.get('backoffice/history', {
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

    return !L && D && (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">
                    <div className="flex flex-col gap-5">
                        <HA data={D?.app} />
                        <HTG data={D?.termgame} />
                        <HP data={D?.pum} />
                        <HU data={D?.logs_users} type="user" />
                        <HU data={D?.logs_admin} type="admin" />
                    </div>
                </div>
            </main>
        </>
    );
}

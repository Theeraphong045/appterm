"use client";
import React, { useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Input,
    Autocomplete,
    AutocompleteItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Next_Link from "next/link";
import { useAuth, useSetting } from "../../../middleware/frontend";
import api from "../../../ess/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
export default function Like_Form() {
    const router = useRouter()
    const { setting } = useSetting()
    const { user, isAuthenticated, update_user, loading } = useAuth()
    const [Service, setService] = useState()
    const [Link, setLink] = useState()
    const [Amount, setAmount] = useState()
    const [ons, setOns] = useState(false)
    const pum = async (e) => {
        e.preventDefault()

        var name = ''
        switch (Service) {
            case '7615':
                name = 'เพิ่มไลค์ [Like 👍] - รับประกัน 1 ปี - 2K/วัน'
                break
            case '7616':
                name = 'เพิ่มอิโมจิ [Love ❤️] - รับประกัน 1 ปี - 2K/วัน'
                break
            case '7617':
                name = 'เพิ่มอิโมจิ [Wow 😲] - รับประกัน 1 ปี - 2K/วัน'
                break
            case '7618':
                name = 'เพิ่มอิโมจิ [Haha 😂] - รับประกัน 1 ปี - 2K/วัน'
                break
            case '7619':
                name = 'เพิ่มอิโมจิ [Sad 😥] - รับประกัน 1 ปี - 2K/วัน'
                break
            case '7620':
                name = 'เพิ่มอิโมจิ [Angry 😡] - รับประกัน 1 ปี - 2K/วัน'
                break
        }
        await api.post('/buy/pum', {
            service: Service,
            link: Link,
            amount: Amount,
            name: name
        }, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (d) => {
                await update_user()
                Swal.fire({
                    title: "สำเร็จ!",
                    text: d.data.msg,
                    icon: "success",
                    confirmButtonColor: '#802eec'
                }).then(() => {
                    router.push('/history')
                })
            })
            .catch((e) => {
                console.log(e)
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: e.response?.data.msg || e.message,
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            })
    }
    return (
        <Card className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50  md:w-1/2">
            <form onSubmit={pum}>
                <CardBody className='my-3 text-center flex items-center h-full justify-center gap-5'>
                    <Autocomplete
                        isRequired
                        label="เลือกบริการไลค์"
                        // variant="bordered"
                        selectedKey={String(Service)}
                        onSelectionChange={setService}
                        className="max-w-sm light"
                    >
                        <AutocompleteItem key='7615' value={7615}>เพิ่มไลค์ [Like 👍] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                        <AutocompleteItem key='7616' value={7616}>เพิ่มอิโมจิ [Love ❤️] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                        <AutocompleteItem key='7617' value={7617}>เพิ่มอิโมจิ [Wow 😲] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                        <AutocompleteItem key='7618' value={7618}>เพิ่มอิโมจิ [Haha 😂] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                        <AutocompleteItem key='7619' value={7619}>เพิ่มอิโมจิ [Sad 😥] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                        <AutocompleteItem key='7620' value={7620}>เพิ่มอิโมจิ [Angry 😡] - รับประกัน 1 ปี - 2K/วัน</AutocompleteItem>
                    </Autocomplete>
                    <p className='text-medium'>สั่งซื้อได้ 50 - 2,000 ไลค์ ราคา {setting.like} บาท/ไลค์</p>
                    <p className='text-medium'>ความเร็ว: 2K/วัน (เริ่มดำเนินการภายใน 1 - 60 นาที)</p>
                    <p className='text-medium'>การรับประกัน: รับประกัน 1 ปี</p>
                    <Input
                        isRequired
                        classNames={{
                            base: "max-w-sm light -mb-[2px] md:col-span-3",
                            inputWrapper:
                                "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                        }}
                        label='ลิงก์โพสต์'
                        type="link"
                        // variant="bordered"
                        value={Link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <Input
                        isRequired
                        classNames={{
                            base: "max-w-sm light -mb-[2px] md:col-span-3",
                            inputWrapper:
                                "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                        }}
                        label='จำนวนไลค์'
                        type="number"
                        // variant="bordered"
                        value={Amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className='text-medium'>ค่าบริการ: {Amount * setting.like || 0} บาท</p>
                    {!isAuthenticated ?
                        <Next_Link href="/auth/signin">
                            <Button color="primary">เข้าสู่ระบบ</Button>
                        </Next_Link>
                        :
                        <Button color="primary" type="submit" disabled={ons || !isAuthenticated}>ยืนยันการทำรายการ</Button>
                    }
                </CardBody>
            </form>
        </Card>
    );
}

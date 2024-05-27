"use client";
import React, { useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Avatar,
    Badge,
    Image,
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
import { useAuth } from "../../../../middleware/frontend";
import api from "../../../../ess/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
export default function Termgame_Desc({ data }) {
    const [T, setT] = useState()
    const [SA, setSA] = useState()
    const [P, setP] = useState(0)
    const [Ref1, setRef1] = useState()
    const [Ref2, setRef2] = useState()
    const [Desc, setDesc] = useState()
    const [ons, setONS] = useState(false)

    const { user, isAuthenticated, update_user, loading } = useAuth()
    const price = (d) => {
        if (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) == 0) {
            return Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[1]?.replace(/[^0-9]/g, "")) - (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[1]?.replace(/[^0-9]/g, "")) * (data?.db?.price / 100))
        } else {
            return Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) - (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) * (data?.db?.price / 100))
        }
    }

    const submit = async (e) => {
        e.preventDefault()
        setONS(true)
        await api.post('termgame', {
            select: data.company_id,
            amount: SA,
            Ref1,
            Ref2,
            P,
            desc: Desc
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
        setONS(false)
    }
    return (
        <div className="grid md:grid-cols-3 gap-5">
            <Card className="h-fit border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/70">
                <CardHeader className="pb-0">{data.db.company_name}</CardHeader>
                <CardBody>
                    <Image
                        width='100%'
                        height='100%'
                        isZoomed
                        className="z-0 overflow-visible object-contain object-center hover:scale-110"
                        src={data?.db?.img || ''}
                        fallbackSrc="https://via.placeholder.com/200x200"
                        alt="Image Apps"
                    />
                    <Divider className="my-3" />
                    <span className="text-small text-default-400" dangerouslySetInnerHTML={{ __html: data?.db?.desc }} />
                </CardBody>
            </Card>
            <div className="flex flex-col gap-5 md:col-span-2">
                <Card className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/70">
                    <CardHeader>เลือกจำนวนที่ต้องการเติม</CardHeader>
                    <CardBody className="grid md:grid-cols-2 gap-5">
                        {data?.denomination?.map((d, i) => (
                            <Card className={`border-2 border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/70 ${SA == i ? 'border-2 border-primary' : ''}`} key={i}>
                                <CardBody className="text-center flex flex-col items-center justify-center hover:cursor-pointer" onClick={() => { setSA(i); setP(price(d).toFixed(2)); setDesc(d?.description?.split('</b>')[1]?.replace('<br />', "")?.replace('small', "p")) }}>
                                    <span className="text-small" dangerouslySetInnerHTML={{ __html: d?.description?.split('</b>')[1]?.replace('<br />', "")?.replace('small', "p") }} />
                                    <span className="text-small">ราคา : {price(d)?.toFixed(2)} บาท</span>
                                </CardBody>
                            </Card>
                        ))}
                    </CardBody>
                </Card>

                <Card className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/70">
                    <CardHeader>ยืนยันการทำรายการ</CardHeader>
                    <form onSubmit={submit}>
                        <CardBody className="flex flex-col justify-center items-center gap-5">
                            <Input
                                isRequired
                                classNames={{
                                    base: "max-w-sm -mb-[2px] md:col-span-3",
                                    inputWrapper:
                                        "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                }}
                                label={data?.db?.input}
                                type="text"
                                variant="bordered"
                                value={Ref1}
                                onChange={(e) => setRef1(e.target.value)}
                            />
                            {data?.gameservers.length > 0 &&

                                <Autocomplete
                                    isRequired
                                    variant="bordered"
                                    label="เลือกเซิฟเวอร์เกม"
                                    className="max-w-sm"
                                    onSelectionChange={setRef2}
                                >
                                    {data?.gameservers.map((d) => (
                                        <AutocompleteItem key={d.value} value={d.value}>
                                            {d.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            }

                            <Image
                                isZoomed
                                src={data?.db?.help}
                            />
                        </CardBody>
                        <CardFooter className="flex justify-end gap-5 items-center">
                            <div>
                                <span className="text-small">ราคารวม {P} บาท</span>
                                <p className="text-small">คุณได้รับส่วนลด {data?.db.price}%</p>
                            </div>
                            {!isAuthenticated ?
                                <Link href="/auth/signin">
                                    <Button color="primary">เข้าสู่ระบบ</Button>
                                </Link>
                                :
                                <Button color="primary" type="submit" disabled={ons || !isAuthenticated || !SA}>ยืนยันการทำรายการ</Button>
                            }
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

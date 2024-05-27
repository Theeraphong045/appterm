'use client'
import { useSetting, useAuth } from "../../../middleware/frontend";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Image,
    Input,
    Button,
    Listbox,
    ListboxItem,
    Spinner
} from "@nextui-org/react";
import Swal from "sweetalert2";
import api from "../../../ess/api";
import Cookies from "js-cookie";

export default function Home() {
    const { setting } = useSetting()
    const { user, isAuthenticated } = useAuth()
    const [D, setD] = useState()
    const [L, setL] = useState()
    useEffect(() => {
        if (D) return false
        fetch()
    }, [setting])

    const fetch = async () => {
        api.get('backoffice/money', {
            headers: {
                Authorization: Cookies.get("token"),
            },
        })
            .then((result) => {
                setD(result.data)
                setL(false)
            }).catch((err) => {
                console.log(err)
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: 'ไม่สามารถผู้ใช้ได้',
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            });
    }
    return (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">
                    <div className="flex gap-12 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">แอปพรีเมี่ยม</p>
                    </div>
                    <Card className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50">
                        <CardBody className='my-3 text-center flex items-center h-full justify-center'>
                            <p className='text-medium'>{D?.app.money || 0} THB</p>
                            <Divider className='my-3' />
                            <p className='text-medium'>จำนวนเงินในระบบ</p>
                        </CardBody>
                    </Card>

                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">เติมเกม</p>
                    </div>
                    <Card className="border-small border-default-200/20 bg-background/60 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
                        <CardBody className='my-3 text-center flex items-center h-full justify-center'>
                            <p className='text-medium'>{D?.termgame.money || 0} THB</p>
                            <Divider className='my-3' />
                            <p className='text-medium'>จำนวนเงินในระบบ</p>
                        </CardBody>
                    </Card>

                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">ปั๊มไลค์</p>
                    </div>
                    <Card className="border-small border-default-200/20 bg-background/60 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
                        <CardBody className='my-3 text-center flex items-center h-full justify-center'>
                            <p className='text-medium'>{D?.pum.money || 0} THB</p>
                            <Divider className='my-3' />
                            <p className='text-medium'>จำนวนเงินในระบบ</p>
                        </CardBody>
                    </Card>
                    {/* <Divider className='my-3' />
                    <p className="text-center text-3xl text-primary">อยู่ระหว่างปรับปรุง</p> */}
                </div>
            </main>
        </>
    );
}
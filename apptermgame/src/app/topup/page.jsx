'use client'
import React, { useEffect, useState } from 'react';

import {
    Image as Img,
    Button,
    Input,
    Spinner,
} from "@nextui-org/react";

import Link from 'next/link';

import { useSetting, useAuth } from '../../../middleware/frontend';
import api from '../../../ess/api';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


import { useSearchParams } from 'next/navigation'

export default function Product() {
    const { setting, ls } = useSetting()
    const { user, isAuthenticated, update_user, loading } = useAuth()
    const router = useRouter()
    const [ons, setONS] = useState(false)
    const [Payload, setPayload] = useState("");
    const [Amount, setAmount] = useState("");
    const [QRCODE, setQRCODE] = useState("");
    const [REF, setREF] = useState("");


    if (!loading && !isAuthenticated) return router.push('/auth/signin')
    const tw = async (e) => {
        e.preventDefault()
        setONS(true)
        api.post('payment/tw', {
            Payload
        }, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (res) => {
                setONS(false)
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: res.data.msg,
                    icon: 'success',
                    confirmButtonText: 'รับทราบ!',
                    confirmButtonColor: '#802eec'
                })
                return rounter.push(`/`)
            })
            .catch((e) => {
                setONS(false)
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: e.response?.data.msg || e.message,
                    icon: 'error',
                    confirmButtonText: 'รับทราบ!',
                    confirmButtonColor: '#802eec'
                })
            })

    }
    const qrcode = async (e) => {
        e.preventDefault()
        setONS(true)
        api.post('payment/qrcode', {
            amount: Amount
        }, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (res) => {
                setONS(false)
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: res.data.msg,
                    icon: 'success',
                    confirmButtonText: 'รับทราบ!',
                    confirmButtonColor: '#802eec'
                })
                setQRCODE(res.data.img)
                setREF(res.data.referenceNo)
                // return rounter.push(`/`)
            })
            .catch((e) => {
                setONS(false)
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: e.response?.data.msg || e.message,
                    icon: 'error',
                    confirmButtonText: 'รับทราบ!',
                    confirmButtonColor: '#802eec'
                })
            })

    }
    const fetch_qrcode = async () => {
        setONS(true)
        api.get(`payment/qr/${REF}`, {
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (res) => {
                setONS(false)
                if (res.data?.status == 1) {
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'เติมเงินสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'รับทราบ!',
                        confirmButtonColor: '#802eec'
                    }).then(async () => {
                        await update_user()
                        router.push('/')
                    })
                } else {
                    Swal.fire({
                        title: 'ไม่พบยอดเงิน!',
                        text: 'กรุณารอ 1-2 นาที และยืนยันใหม่อีกครั้ง',
                        icon: 'error',
                        confirmButtonText: 'รับทราบ!',
                        confirmButtonColor: '#802eec'
                    })
                }
            })
            .catch((e) => {
                setONS(false)
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: e.response?.data.msg || e.message,
                    icon: 'error',
                    confirmButtonText: 'รับทราบ!',
                    confirmButtonColor: '#802eec'
                })
            })

    }
    return (
        <div className="flex w-full flex-col gap-4 rounded-large">
            <div className="flex flex-col items-center pb-6">
                <Img src={setting?.logo} width={60} className="mr-3" alt="Logo" />
                <div className="flex gap-5 h-12 items-center">
                    <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">เติมเงิน</p>
                </div>
                <p className="text-small text-default-500">Topup</p>
            </div>
            <div className='grid md:grid-cols-2 gap-12 justify-center text-center'>
                <form className="flex flex-col gap-3 items-center" onSubmit={tw}>
                    <div className='flex flex-col w-full justify-center items-center'>
                        <Img src="/icon-bank/gitf.png" alt="ซองของขวัญ" height={100} />
                        <p className='mt-2 text-xl'>ซองของขวัญ</p>
                        <p className='mt-2 text-xl'>ฟรีค่าธรรมเนียม</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                            }}
                            label="ลิงก์ซองของขวัญ"
                            name="url"
                            type="link"
                            variant="bordered"
                            value={Payload}
                            onChange={(e) => setPayload(e.target.value)}
                            description='ขั้นต่ำ 10 บาท'
                        />

                    </div>
                    <Button fullWidth color={!ons ? 'primary' : 'default'} disabled={ons} type="submit">
                        {!ons ? 'เติมเงิน' : <><Spinner size="sm" />กำลังเติมเงิน</>}
                    </Button>
                </form>
                <form className="flex flex-col gap-3 items-center" onSubmit={qrcode}>
                    <div className='flex flex-col w-full justify-center items-center'>
                        <Img src="/icon-bank/pp.png" alt="ซองของขวัญ" height={100} />
                        <p className='mt-2 text-xl'>พร้อมเพย์</p>
                        <p className='mt-2 text-xl'>ฟรีค่าธรรมเนียม</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        {!QRCODE ? <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                            }}
                            label="จำนวนเงิน"
                            name="amount"
                            type="number"
                            min={1}
                            variant="bordered"
                            value={Amount}
                            onChange={(e) => setAmount(e.target.value)}
                            description='ขั้นต่ำ 10 บาท'
                        /> :
                            <Img src={QRCODE} alt="ซองของขวัญ" className='w-full' />
                        }

                    </div>
                    {!QRCODE ?
                        <Button fullWidth color={!ons ? 'primary' : 'default'} disabled={ons} type="submit">
                            {!ons ? 'เติมเงิน' : <><Spinner size="sm" />กำลังเติมเงิน</>}
                        </Button>
                        :
                        <Button fullWidth color={!ons ? 'primary' : 'default'} onClick={() => fetch_qrcode()} type="button">
                            {!ons ? 'ตรวจสอบยอดเงิน' : <><Spinner size="sm" />กำลังตรวจสอบยอดเงิน</>}
                        </Button>
                    }
                </form>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Divider, Image, Chip, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import api from "../../../ess/api";
import { useSetting } from "../../../middleware/frontend";
import { uploadFile } from 'ru6su6.dev'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'

export default function Install() {
    const turnstile = useTurnstile();
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
    const { setting, update_setting } = useSetting()
    // const { update_user } = useAuth()

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirm_Password] = useState("")
    const [Title, setTitle] = useState("")
    const [Desc, setDesc] = useState("")
    const [Logo, setLogo] = useState()
    const [Fav, setFav] = useState()
    const [Domain, setDomain] = useState()
    const [Contact, setContact] = useState()
    const [Keyword, setKeyword] = useState()
    const [Termgame, setTermgame] = useState()
    const [Byshop, setByshop] = useState()
    const [Pumlf, setPumlf] = useState()
    const [Step, setStep] = useState(2)
    const [ons, setONS] = useState(false)
    const [Token, setToken] = useState()


    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        const maxSize = 100 * 1024 * 1024;
        if (file?.size > maxSize) {
            MySwal.fire({
                title: <strong>Error!</strong>,
                html: <b>ไฟล์มีขนาดเกินกำหนด (ไม่เกิน 100 MB)</b>,
                icon: 'error'
            })
            event.target.value = null;
            return;
        } else {
            try {
                const result = await uploadFile(file);
                if (type == 'logo') {
                    setLogo(result.url)
                } else if (type == 'fav') {
                    setFav(result.url)
                }
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการส่งคำขอ:', error);
                return MySwal.fire({
                    title: <strong>Error!</strong>,
                    html: <b>เกิดข้อผิดพลาดในการอัพโหลดไฟล์</b>,
                    icon: 'error'
                })
            }
        }
    };

    const submit = async (e) => {
        e.preventDefault()
        setONS(true)
        await api.post('install', {
            email,
            username,
            password,
            Title,
            Desc,
            Logo,
            Fav,
            Domain,
            Contact,
            Keyword,
            Termgame,
            Byshop,
            Pumlf,
            Token
        })
            .then(async (d) => {
                await Cookies.set('token', d.data.token, { expires: 1 })
                // toast.success(d.data.msg)
                await update_setting()
                await update_user()
                router.push('/')
            })
            .catch((e) => {
                console.log(e)
                turnstile.reset()
            })
        setONS(false)
    }
    return setting?.install == 0 && (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
                <div className="flex flex-col items-center pb-6">
                    <Image src={setting?.logo || 'https://m1r.ai/9/ckxur.png'} width={60} className="mr-3" alt="Logo" />
                    <p className="text-xl font-medium">ติดตั้งเว็บไซต์</p>
                    <p className="text-small text-default-500">Install Web Site</p>
                </div>
                <form className="flex flex-col gap-3" onSubmit={submit}>
                    {Step == 1 ?
                        <>
                            <Chip color="primary">สร้างบัญชีแอดมิน</Chip>
                            <div className="flex flex-col gap-3">
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    label="ชื่ผู้ใช้"
                                    name="username"
                                    type="text"
                                    variant="bordered"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                />

                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    label="อีเมล"
                                    type="email"
                                    name="email"
                                    variant="bordered"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />

                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    endContent={
                                        <button type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <Icon
                                                    className="pointer-events-none text-2xl text-default-400"
                                                    icon="solar:eye-closed-linear"
                                                />
                                            ) : (
                                                <Icon
                                                    className="pointer-events-none text-2xl text-default-400"
                                                    icon="solar:eye-bold"
                                                />
                                            )}
                                        </button>
                                    }
                                    label="รหัสผ่าน"
                                    name="password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    errorMessage={password.length < 8 && "รหัสผ่านต้องมีความยาว 8 ตัวอักษรขึ้นไป"}
                                />

                                <Input
                                    isRequired
                                    classNames={{
                                        inputWrapper: "rounded-t-none",
                                    }}
                                    endContent={
                                        <button type="button" onClick={toggleConfirmVisibility}>
                                            {isConfirmVisible ? (
                                                <Icon
                                                    className="pointer-events-none text-2xl text-default-400"
                                                    icon="solar:eye-closed-linear"
                                                />
                                            ) : (
                                                <Icon
                                                    className="pointer-events-none text-2xl text-default-400"
                                                    icon="solar:eye-bold"
                                                />
                                            )}
                                        </button>
                                    }
                                    label="ยืนยันรหัสผ่าน"
                                    name="confirm_password"
                                    type={isConfirmVisible ? "text" : "password"}
                                    variant="bordered"
                                    value={confirm_password}
                                    onChange={(e) => { setConfirm_Password(e.target.value) }}
                                    errorMessage={password !== confirm_password && "รหัสผ่านไม่ตรงกัน"}
                                />
                            </div>
                            <Button color={password !== confirm_password && "รหัสผ่านไม่ตรงกัน" ? 'default' : 'primary'} type="button" disabled={password.length < 8 || password !== confirm_password} onClick={() => setStep(2)}>
                                ถัดไป
                            </Button>
                        </>
                        : Step == 2 &&
                        <>

                            <Chip color="primary">ตั้งค่าเว็บไซต์</Chip>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex justify-center items-center">
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="ชื่อเว็บไซต์"
                                    name="title"
                                    type="text"
                                    variant="bordered"
                                    value={Title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="รายละเอียดเว็บไซต์"
                                    name="desc"
                                    type="text"
                                    variant="bordered"
                                    value={Desc}
                                    onChange={(e) => { setDesc(e.target.value) }}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-t-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="โดเมน ชื่อเว็บไซต์.ru6su6.cloud"
                                    name="domain"
                                    type="text"
                                    variant="bordered"
                                    value={Domain}
                                    onChange={(e) => { setDomain(e.target.value) }}
                                />

                                <label className="block">
                                    <p className="text-gray-400 mb-2">โลโก้</p>
                                    <input
                                        id='uploadFile'
                                        type="file"
                                        className="block w-full text-sm text-gray-400
                                        file:me-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-default file:text-white
                                        file:cursor-pointer
                                        file:disabled:opacity-50 file:disabled:pointer-events-none"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'logo')}
                                    />
                                </label>
                                <Image
                                    width={100}
                                    height={100}
                                    className="z-0 overflow-visible object-contain object-center hover:scale-110"
                                    src={Logo || ''}
                                    fallbackSrc="https://via.placeholder.com/100x100"
                                    alt="NextUI Image with fallback"
                                />


                                <label className="block">
                                    <p className="text-gray-400 mb-2">ไอคอน</p>
                                    <input
                                        id='uploadFile'
                                        type="file"
                                        className="block w-full text-sm text-gray-400
                                        file:me-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-default file:text-white
                                        file:cursor-pointer
                                        file:disabled:opacity-50 file:disabled:pointer-events-none"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'fav')}
                                    />
                                </label>

                                <Image
                                    width={100}
                                    height={100}
                                    className="z-0 overflow-visible object-contain object-center hover:scale-110"
                                    src={Fav || ''}
                                    fallbackSrc="https://via.placeholder.com/100x100"
                                    alt="NextUI Image with fallback"
                                />

                                <Input
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="Keyword"
                                    placeholder="ตัวอย่าง (แอปพรีเมี่ยม,เติมเกม)"
                                    type="text"
                                    variant="bordered"
                                    value={Keyword}
                                    onChange={(e) => { setKeyword(e.target.value) }}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-t-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="ลิงก์ Facebook"
                                    type="link"
                                    variant="bordered"
                                    value={Contact}
                                    onChange={(e) => { setContact(e.target.value) }}
                                />


                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="Key Termgame"
                                    placeholder="ติดต่อขอ Key ได้ที่ Ru6Su6 หรือ NoNamePlay"
                                    type="text"
                                    variant="bordered"
                                    value={Termgame}
                                    onChange={(e) => { setTermgame(e.target.value) }}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="Key Byshop"
                                    placeholder="ได้จาก Byshop.me (apikey)"
                                    type="text"
                                    variant="bordered"
                                    value={Byshop}
                                    onChange={(e) => { setByshop(e.target.value) }}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="Key Pumlf"
                                    placeholder="ได้จาก Byshop.me (apikey)"
                                    type="text"
                                    variant="bordered"
                                    value={Pumlf}
                                    onChange={(e) => { setPumlf(e.target.value) }}
                                />
                                <div className="col-span-2">
                                    <Turnstile
                                        className="Turnstile"
                                        sitekey={process.env.NEXT_PUBLIC_CF_Key}
                                        onVerify={(token) => setToken(token)}
                                        theme="dark"
                                    />
                                </div>

                                <Button color="default" type="button" onClick={() => setStep(1)}>
                                    ย้อนกลับ
                                </Button>
                                <Button color={!ons ? 'primary' : 'default'} disabled={ons} type="submit">
                                    {!ons ? 'ติดตั้งเว็บไซต์' : <><Spinner size="sm" />กำลังติดตั้งเว็บไซต์</>}
                                </Button>
                            </div>
                        </>
                    }
                </form>
            </div>
        </div>
    );
}

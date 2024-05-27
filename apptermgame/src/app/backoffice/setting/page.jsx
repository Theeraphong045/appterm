'use client'
import React, { useEffect, useState } from "react";
import { Button, Input, Checkbox, Divider, Image, Chip, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import api from "../../../../ess/api";
import { useSetting } from "../../../../middleware/frontend";
import { uploadFile } from 'ru6su6.dev'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import Swal from "sweetalert2";
export default function Setting() {
    const { setting, update_setting, ls } = useSetting()
    const router = useRouter()

    const [Title, setTitle] = useState('')
    const [Desc, setDesc] = useState('')
    const [Logo, setLogo] = useState('')
    const [Fav, setFav] = useState('')
    const [Domain, setDomain] = useState('')
    const [Keyword, setKeyword] = useState('')
    const [Contact, setContact] = useState('')
    const [Like, setLike] = useState('')
    const [ons, setONS] = useState(false)
    useEffect(() => {
        if (setting) {
            setTitle(setting?.title)
            setDesc(setting?.desc)
            setLogo(setting?.logo)
            setFav(setting?.fav)
            setDomain(setting?.domain)
            setKeyword(setting?.keyword)
            setContact(setting?.contact)
            setLike(setting?.like)
        }
    }, [!ls])

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        const maxSize = 100 * 1024 * 1024;
        if (file?.size > maxSize) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด?",
                text: 'ไฟล์มีขนาดเกินกำหนด (ไม่เกิน 100 MB)',
                icon: "error",
                confirmButtonColor: '#802eec'
            });
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
                return Swal.fire({
                    title: "เกิดข้อผิดพลาด?",
                    text: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์',
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            }
        }
    };

    const submit = async (e) => {
        e.preventDefault()
        setONS(true)
        await api.put('backoffice/setting', {
            id: setting._id,
            Title,
            Desc,
            Logo,
            Fav,
            Domain,
            Keyword,
            Contact,
            Like,
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
                await update_setting()
                router.push('/backoffice/setting')
            })
            .catch((e) => {
                console.log(e)
            })
        setONS(false)
    }
    return (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex justify-center items-center">
                            <>
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
                                    label="โดเมน ru6su6.cloud"
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
                                    isZoomed
                                    src={Logo || ''}
                                    fallbackSrc="https://via.placeholder.com/100x100"
                                    alt="Image"
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
                                    isZoomed
                                    src={Fav || ''}
                                    fallbackSrc="https://via.placeholder.com/100x100"
                                    alt="Image"
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
                                    label="ช่องทางการติดต่อ"
                                    placeholder="ลิงก์ช่องทางติดต่อ"
                                    type="text"
                                    variant="bordered"
                                    value={Contact}
                                    onChange={(e) => { setContact(e.target.value) }}
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        base: "-mb-[2px]",
                                        inputWrapper:
                                            "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                    }}
                                    className="col-span-2"
                                    label="ราคาไลค์"
                                    placeholder="ราคาต่อ 1 ไลค์"
                                    type="text"
                                    variant="bordered"
                                    value={Like}
                                    onChange={(e) => { setLike(e.target.value) }}
                                />
                            </>

                            <Button color={!ons ? 'primary' : 'default'} disabled={ons} className="md:col-span-2" type="submit">
                                {!ons ? 'ตั้งค่าเว็บไซต์' : <><Spinner size="sm" />กำลังตั้งค่าเว็บไซต์</>}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

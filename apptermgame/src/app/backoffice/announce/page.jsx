'use client'
import { useSetting, useAuth } from "../../../../middleware/frontend";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../../../ess/api";
import Swal from "sweetalert2";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Divider,
    Input,
    Spinner,
    Autocomplete,
    AutocompleteSection,
    AutocompleteItem,
    Textarea,
} from "@nextui-org/react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { uploadFile } from "ru6su6.dev";

export default function Termgame_Backoffice() {
    const { setting } = useSetting()
    const { user, isAuthenticated } = useAuth()
    const [D, setD] = useState()
    const [toggleOneModal, setToggleOneModal] = useState(false);

    const [T, setT] = useState()
    const [I, setI] = useState()
    const [C, setC] = useState()
    const [ID, setID] = useState()
    const [Ons, setONS] = useState(false)
    const [E, setE] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (D) return false
        fetch()
    }, [])
    const fetch = async () => {
        api.get('/backoffice/announce', {
            headers: {
                authorization: Cookies.get('token')
            }
        }).then((d) => {
            setD(d.data)
        }).catch((err) => {
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: err.response?.data.msg || err.message,
                icon: "error",
                confirmButtonColor: '#802eec'
            });
        })
    }


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
                setI(result.url)
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
        if (!T || !I) return
        Swal.fire({
            title: "เกิดข้อผิดพลาด?",
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon: "error",
            confirmButtonColor: '#802eec'
        });
        setONS(true)
        if (E) {
            await api.put('backoffice/announce', {
                ID: ID,
                Title: T,
                Image: I,
                Content: C,
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
                    setI()
                })
                .catch((err) => {

                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                })
        } else {
            await api.post('backoffice/announce', {
                Title: T,
                Image: I,
                Content: C,
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
                .catch((err) => {

                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                })
        }
        setONS(false)
    }

    const Delete = async (id, title) => {
        setONS(true)

        await api.delete('backoffice/announce', {
            params: {
                id,
                title
            },
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
            })
            .catch((err) => {

                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: err.response?.data.msg || err.message,
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            })
        setONS(false)
    }
    return (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">

                    <Button onClick={() => { setT(); setC(); setI(); setE(false); onOpen() }} className="w-full" color="primary">เพิ่มประกาศ</Button>
                    <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" size="2xl">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form className="flex flex-col gap-5" onSubmit={submit}>
                                        <ModalHeader className="flex flex-col gap-1">{E ? 'แก้ไขประกาศ' : 'เพิ่มประกาศ'}</ModalHeader>
                                        <ModalBody className="grid md:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-5">
                                                <Input
                                                    isRequired
                                                    classNames={{
                                                        base: "-mb-[2px]",
                                                        inputWrapper:
                                                            "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                                    }}
                                                    label="ชื่อประกาศ"
                                                    name="title"
                                                    type="text"
                                                    variant="bordered"
                                                    value={T}
                                                    onChange={(e) => { setT(e.target.value) }}
                                                />

                                                <Textarea
                                                    label="รายละเอียดประกาศ"
                                                    variant="bordered"
                                                    isRequired
                                                    onChange={(e) => setC(e.target.value)}
                                                    value={C}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-5">
                                                <label className="block">
                                                    <p className="text-gray-400 mb-2">รูปประกาศ</p>
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
                                                        onChange={(e) => handleFileChange(e)}
                                                    />
                                                </label>
                                                <Image
                                                    isZoomed
                                                    src={I || ''}
                                                    alt="Image"
                                                />
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" type="button" onPress={onClose}>
                                                ยกเลิก
                                            </Button>
                                            <Button color="primary" type="submit" disabled={Ons}>
                                                {E ? 'แก้ไขประกาศ' : 'เพิ่มประกาศ'}
                                            </Button>
                                        </ModalFooter>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>

                    {!D && <Spinner color="parimary" label="กำลังโหลด..." />}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {D && D.map((d, i) => (
                            <Card className="py-4 border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" key={i}>
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                    <h4 className="font-bold text-large">{d?.title}</h4>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        isZoomed
                                        width='100%'
                                        alt="Image"
                                        className="object-cover rounded-xl w-full"
                                        src={d?.image}
                                    />
                                </CardBody>
                                <CardFooter className="grid md:grid-cols-2 gap-2">
                                    <Button type="button" color="warning" onClick={() => { setID(d?._id); setT(d?.title); setI(d?.image); setC(d?.content); setE(true); onOpen(); }}>แก้ไข</Button>
                                    <Button type="button" color="danger" onClick={() => { Delete(d?._id, d?.title) }}>ลบ</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

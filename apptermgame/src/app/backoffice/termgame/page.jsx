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
    Button,
    Image,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
} from "@nextui-org/react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { uploadFile } from "ru6su6.dev";

export default function Termgame_Backoffice() {
    const { setting } = useSetting()
    const { user, isAuthenticated } = useAuth()
    const [D, setD] = useState()
    const [toggleOneModal, setToggleOneModal] = useState(false);
    const [Desc, setDesc] = useState()
    const [Editing, setEditing] = useState(false)

    const [ID, setID] = useState()
    const [Name, setName] = useState()
    const [Img, setImg] = useState()
    const [Cashback, setCashback] = useState()
    const [DE, setDE] = useState()
    const [InputName, setInputName] = useState()
    const [InputImage, setInputImage] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (D) return false
        fetch()
    }, [])
    const fetch = async () => {
        api.get('/backoffice/termgame', {
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

    const sub = async (e) => {
        e.preventDefault()
        if (Editing) {
            api.put('/backoffice/termgame', {
                id: Desc?.company_id,
                name: Name,
                img: Img,
                price: Cashback,
                desc: DE,
                input: InputName,
                help: InputImage
            }, {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            })
                .then((result) => {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: result.data.msg,
                        icon: "success",
                        confirmButtonColor: '#802eec'
                    });
                    setToggleOneModal(!toggleOneModal)
                    fetch()
                    onOpenChange(0)
                }).catch((err) => {
                    console.log(err)

                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                });
        } else {
            api.post('/backoffice/termgame', {
                id: Desc?.company_id,
                img: Img,
                name: Name,
                price: Cashback,
                desc: DE,
                input: InputName,
                help: InputImage
            }, {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            })
                .then((result) => {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: result.data.msg,
                        icon: "success",
                        confirmButtonColor: '#802eec'
                    });
                    setToggleOneModal(!toggleOneModal)
                    fetch()
                    onOpenChange(0)
                }).catch((err) => {
                    console.log(err)

                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                });
        }
    }

    const del = async (id, name) => {
        await api.delete('/backoffice/termgame', {
            params: {
                id,
                name
            },
            headers: {
                authorization: Cookies.get('token')
            }
        })
            .then(async (ress) => {
                Swal.fire({
                    title: "สำเร็จ!",
                    text: ress.data.msg,
                    icon: "success",
                    confirmButtonColor: '#802eec'
                });
                fetch()
            })
            .catch(function (err) {
                console.log(err)
                Swal.fire({
                    title: "เกิดข้อผิดพลาด?",
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
                if (type == 'game') {
                    setImg(result.url)
                } else {
                    setInputImage(result.url)
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
    return (
        <>
            <main className="mt-4 h-full max-h-[90%] w-full overflow-visible">
                <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider overflow-auto p-5">
                    {!D && <Spinner color="parimary" label="กำลังโหลด..." />}
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
                        {D && D?.map((d, i) => (
                            <Card className="py-4 border-small border-default-200/20 bg-background/60 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                    <p className="text-tiny uppercase font-bold">{d?.db?.company_name || d?.company_name}</p>
                                    <small className="text-default-500">ความเร็ว : {d?.speed ? <span className="text-green-500">ได้รับทันที</span> : 'เติมช้า'}</small>
                                    <small className="text-default-500">Cashback : {d?.cashback}%</small>
                                    <small className="text-default-500">กำไร : {`${!d?.db ? 0 : `${d?.cashback - d?.db?.price}`}`}%</small>
                                </CardHeader>
                                {d?.db &&
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            width='100%'
                                            height='100%'
                                            isZoomed
                                            className="z-0 overflow-visible object-contain object-center hover:scale-110"
                                            src={d?.db?.img || ''}
                                            fallbackSrc="https://via.placeholder.com/200x200"
                                            alt="Image Apps"
                                        />
                                    </CardBody>
                                }
                                <CardFooter className="grid md:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {d?.db ?
                                        <>
                                            <Button type="button" color="warning" onClick={() => {
                                                onOpen();
                                                setDesc(d);
                                                setEditing(true);
                                                setName(d?.db?.company_name)
                                                setImg(d?.db?.img)
                                                setCashback(d?.db?.price)
                                                setDE(d?.db?.desc)
                                                setInputName(d?.db?.input)
                                                setInputImage(d?.db?.help)
                                            }} className="w-full">แก้ไข</Button>
                                            <Button type="button" color="danger" className="w-full" onClick={() => del(d?.db?._id, d?.db?.company_name)}>ลบเกม</Button>
                                        </>
                                        :
                                        <Button type="button" color="primary" onClick={() => {
                                            onOpen();
                                            setDesc(d);
                                            setEditing(false);
                                            setName(d?.company_name)
                                            setImg('')
                                            setDE()
                                            setCashback(d?.cashback)
                                            setInputName()
                                            setInputImage()
                                        }} className="w-full lg:col-span-2">เพิ่มเกม</Button>
                                    }
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" size="xl" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <form onSubmit={sub}>
                                    <ModalHeader className="flex flex-col gap-1">{!Editing ? 'เพิ่มเกม' : 'แก้ไขเกม'}</ModalHeader>
                                    <ModalBody>
                                        <h3>{Desc?.company_name}</h3>
                                        <h5 className="text-default-500">ความเร็ว : {Desc?.speed ? <span className="text-green-500">ได้รับทันที</span> : 'เติมช้า'}</h5>
                                        <h5 className="text-default-500">Cashback : {Desc?.cashback}%</h5>
                                        <Input
                                            isRequired
                                            classNames={{
                                                base: "-mb-[2px] md:col-span-3",
                                                inputWrapper:
                                                    "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                            }}
                                            label="ชื่อเกม"
                                            name="name"
                                            type="text"
                                            variant="bordered"
                                            value={Name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Input
                                            isRequired
                                            classNames={{
                                                base: "-mb-[2px] md:col-span-3",
                                                inputWrapper:
                                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                            }}
                                            label="ลดราคาจากปกติ %"
                                            name="cashback"
                                            type="number"
                                            variant="bordered"
                                            value={Cashback}
                                            onChange={(e) => setCashback(e.target.value)}
                                            description={`**หากตั้ง ${Desc?.cashback} จะไม่ได้กำไร หากต้องการกำไรให้ตั้งต่ำกว่า Cashback`}
                                        />
                                        <ReactQuill theme="snow" value={DE} onChange={(e) => setDE(e)} />

                                        <label className="block">
                                            <p className="text-gray-400 mb-2">รูปเกม</p>
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
                                                onChange={(e) => handleFileChange(e, 'game')}
                                            />
                                        </label>

                                        <Image
                                            width={100}
                                            height={100}
                                            isZoomed
                                            src={Img || ''}
                                            fallbackSrc="https://via.placeholder.com/100x100"
                                            alt="Image Apps"
                                        />
                                        <Input
                                            isRequired
                                            classNames={{
                                                base: "-mb-[2px] md:col-span-3",
                                                inputWrapper:
                                                    "data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                            }}
                                            label="ชื่อช่องกรอก ID"
                                            placeholder="ตัวอย่าง Account ID"
                                            name="inputname"
                                            type="text"
                                            variant="bordered"
                                            value={InputName}
                                            onChange={(e) => setInputName(e.target.value)}
                                        />

                                        <label className="block">
                                            <p className="text-gray-400 mb-2">วิธีการดู {InputName || 'Account ID'}</p>
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
                                                onChange={(e) => handleFileChange(e, 'help')}
                                            />
                                        </label>

                                        <Image
                                            width="100%"
                                            height="100%"
                                            isZoomed
                                            src={InputImage || ''}
                                            alt="Image Apps"
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button color="primary" type="submit">
                                            {!Editing ? 'เพิ่มเกม' : 'แก้ไขเกม'}
                                        </Button>
                                    </ModalFooter>
                                </form>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </main>
        </>
    );
}

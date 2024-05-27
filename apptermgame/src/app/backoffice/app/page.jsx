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
    const [Price, setPrice] = useState()
    const [DE, setDE] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (D) return false
        fetch()
    }, [])
    const fetch = async () => {
        api.get('/backoffice/app', {
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
            api.put('backoffice/app', {
                id: ID,
                name: Name,
                img: Img,
                price: Price,
                desc: DE
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
                        title: "เกิดข้อผิดพลาด?",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                });
        } else {
            api.post('backoffice/app', {
                id: ID,
                name: Name,
                img: Img,
                price: Price,
                desc: DE
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
                        title: "เกิดข้อผิดพลาด?",
                        text: err.response?.data.msg || err.message,
                        icon: "error",
                        confirmButtonColor: '#802eec'
                    });
                });
        }
    }

    const del = async (id, name) => {
        await api.delete('/backoffice/app', {
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
            .catch(function (error) {
                console.log(error)
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
                setImg(result.url)
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
                                    <p className="text-tiny uppercase font-bold">{d?.db?.name || d?.api?.name}</p>
                                    <small className="text-default-500">สต๊อก : {d?.api?.stock}</small>
                                    <small className="text-default-500">ราคาทุน : {d?.api?.price}</small>
                                    <small className="text-default-500">ราคาขาย : {d?.db?.price}</small>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        width='100%'
                                        isZoomed
                                        src={d?.db?.img || ''}
                                        alt="Image Apps"
                                    />
                                </CardBody>
                                <CardFooter className="grid lg:grid-cols-2 gap-4">
                                    {d?.db ?
                                        <>
                                            <Button type="button" color="warning" onClick={() => {
                                                onOpen(); setDesc(d);
                                                setEditing(true);
                                                setName(d?.db.name)
                                                setImg(d?.db.img)
                                                setID(d?.db._id)
                                                setDE(d?.db.desc || d?.api.product_info)
                                                setPrice(d?.db.price)
                                            }} className="w-full">แก้ไข</Button>
                                            <Button type="button" color="danger" className="w-full" onClick={() => del(d?.db?._id, d?.db?.name)}>ลบแอป</Button>
                                        </>
                                        :
                                        <Button type="button" color="primary" onClick={() => {
                                            onOpen(); setDesc(d);
                                            setEditing(false);
                                            setName(d?.api.name)
                                            setDE(d?.api.product_info)
                                            setImg('')
                                            setID(d?.api.id)
                                            setPrice(d?.api.price)
                                        }} className="w-full lg:col-span-2">เพิ่มแอปพรีเมี่ยม</Button>
                                    }
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <form onSubmit={sub}>
                                    <ModalHeader className="flex flex-col gap-1">{!Editing ? 'เพิ่มแอปพรีเมี่ยม' : 'แก้ไขแอปพรีเมี่ยม'}</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            isRequired
                                            classNames={{
                                                base: "-mb-[2px]",
                                                inputWrapper:
                                                    "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                            }}
                                            label="ชื่อแอป"
                                            name="name"
                                            type="text"
                                            variant="bordered"
                                            value={Name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <p className="text-start">ราคาทุน : {Desc?.api.price}</p>
                                        <Input
                                            isRequired
                                            classNames={{
                                                base: "-mb-[2px]",
                                                inputWrapper:
                                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                            }}
                                            label="ราคา"
                                            name="price"
                                            type="text"
                                            variant="bordered"
                                            placeholder="ต้องมีทศนิยม ตัวอย่าง 100.00"
                                            value={Price}
                                            onChange={(e) => setPrice(e.target.value)} required
                                        />
                                        <ReactQuill theme="snow" value={DE} onChange={(e) => setDE(e)} />

                                        <label className="block">
                                            <p className="text-gray-400 mb-2">รูปแอป</p>
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
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                        <Image
                                            width={100}
                                            height={100}
                                            className="z-0 overflow-visible object-contain object-center hover:scale-110"
                                            src={Img || ''}
                                            fallbackSrc="https://via.placeholder.com/100x100"
                                            alt="Image Apps"
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button color="primary" type="submit">
                                            {!Editing ? 'เพิ่มแอปพรีเมี่ยม' : 'แก้ไขแอปพรีเมี่ยม'}
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

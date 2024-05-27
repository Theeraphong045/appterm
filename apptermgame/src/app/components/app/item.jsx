"use client";
import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useAuth } from "../../../../middleware/frontend";
import api from "../../../../ess/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
export default function APP_item({ data }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, isAuthenticated, update_user, loading } = useAuth()
    const [ONS, setONS] = useState(false)
    const buy = async () => {
        setONS(true)
        await api.post('/buy/app', {
            id: data._id
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
                    confirmButtonColor: '#f77f00'
                });
            })
            .catch((e) => {
                console.log(e)
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: e.response?.data.msg || e.message,
                    icon: "error",
                    confirmButtonColor: '#f77f00'
                });
            })
        setONS(false)
    }
    return (
        <>
            <Card className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" >
                <CardBody className="text-center">
                    <Image
                        width='100%'
                        height='100%'
                        isZoomed
                        className="hover:cursor-pointer"
                        src={data.img || ''}
                        fallbackSrc="https://via.placeholder.com/200x200"
                        alt="Image Apps"
                    />
                    <p className="my-1">{data.name}</p>
                    <p className="my-1">ราคา : {data.price} บาท</p>
                    <p className="my-1">คงเหลือ : {data.stock} ชิ้น</p>
                    {data?.stock > 0 ? <Button onPress={onOpen} className="my-1" color="primary">สั่งซื้อ</Button> : <Button isDisabled className="my-1" color="warning">สินค้าหมด</Button>}
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{data.name}</ModalHeader>
                            <ModalBody className="text-center">
                                <Image
                                    width='100%'
                                    height='100%'
                                    isZoomed
                                    className="hover:cursor-pointer"
                                    src={data.img || ''}
                                    fallbackSrc="https://via.placeholder.com/200x200"
                                    alt="Image Apps"
                                />
                                <span dangerouslySetInnerHTML={{ __html: data.desc }} />
                                <p className="mt-2">ราคา : {data.price} บาท</p>
                                <p className="mt-2">คงเหลือ : {data.stock} ชิ้น</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    ปิด
                                </Button>
                                {isAuthenticated ?
                                    <Button color="primary" onClick={buy} disabled={ONS}>
                                        สั่งซื้อ
                                    </Button>
                                    :
                                    <Link href="/auth/signin">
                                        <Button color="primary" disabled={ONS}>
                                            เข้าสู่ระบบ
                                        </Button>
                                    </Link>
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
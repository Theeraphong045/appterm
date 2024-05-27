'use client'
import React, { useState, useMemo, useEffect } from "react";
import { useSetting, useAuth } from "../../../middleware/frontend";
import Cookies from "js-cookie";
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
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
    Select, SelectItem
} from "@nextui-org/react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { uploadFile } from "ru6su6.dev";
import api from "../../../ess/api";

export default function History() {
    const { setting } = useSetting()
    const { user, isAuthenticated } = useAuth()
    const [D, setD] = useState()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [Fix, setFix] = useState(false)
    const [Desc, setDesc] = useState()
    const [FixValue, setFixValue] = useState()
    const [SMS, setSMS] = useState()

    useEffect(() => {
        if (D) return false
        fetch()
    }, [])
    const fetch = async () => {
        api.get('/history', {
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



    const fix = async (e) => {
        e.preventDefault()
        api.post('fix', {
            orderid: Desc?.id,
            report_id: FixValue
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
                setToggleOneModal2(!toggleOneModal2)
                getHistory()
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

    const smsotp = async () => {
        api.post('otp', {
            type: Desc?.name.split(' ')[0] == 'Disney+' ? 'disney' : Desc?.name.split(' ')[0] == 'TrueID+' ? 'trueid' : Desc?.name.split(' ')[0] == 'AIS' ? 'aisplay' : 'beinsports'
        }, {
            headers: {
                Authorization: Cookies.get("token"),
            },
        })
            .then(async (data) => {
                setSMS(data.data)
            })
            .catch((err) => {
                console.log(err)
                Swal.fire({
                    title: "เกิดข้อผิดพลาด?",
                    text: err.response?.data.msg || err.message,
                    icon: "error",
                    confirmButtonColor: '#802eec'
                });
            });
    }

    const [page1, setPage1] = useState(1);
    const rowsPerPage1 = 10;

    const pages1 = Math.ceil(D?.app.length / rowsPerPage1);

    const items1 = useMemo(() => {
        const start = (page1 - 1) * rowsPerPage1;
        const end = start + rowsPerPage1;

        return D?.app.slice(start, end);
    }, [page1, D]);

    const [page2, setPage2] = useState(1);
    const rowsPerPage2 = 10;

    const pages2 = Math.ceil(D?.termgame.length / rowsPerPage2);

    const items2 = useMemo(() => {
        const start = (page2 - 1) * rowsPerPage2;
        const end = start + rowsPerPage2;
        return D?.termgame.slice(start, end);
    }, [page2, D]);

    const [page3, setPage3] = useState(1);
    const rowsPerPage3 = 10;

    const pages3 = Math.ceil(D?.logs.length / rowsPerPage3);

    const items3 = useMemo(() => {
        const start = (page3 - 1) * rowsPerPage3;
        const end = start + rowsPerPage3;
        return D?.logs.slice(start, end);
    }, [page3, D]);

    const [page4, setPage4] = useState(1);
    const rowsPerPage4 = 10;

    const pages4 = Math.ceil(D?.pum.length / rowsPerPage4);

    const items4 = useMemo(() => {
        const start = (page4 - 1) * rowsPerPage4;
        const end = start + rowsPerPage4;
        return D?.pum.slice(start, end);
    }, [page3, D]);


    return (
        <>
            {!D && <div className="flex w-full justify-center items-center"><Spinner color="parimary" label="กำลังโหลด..." /></div>}

            {D &&
                <div className="flex flex-col gap-5">
                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">แอปพรีเมี่ยม</p>
                    </div>
                    <Table
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page1}
                                    total={pages1}
                                    onChange={(page) => setPage1(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="transaction_id">ORDER ID</TableColumn>
                            <TableColumn key="company_id">เกม</TableColumn>
                            <TableColumn key="time">เวลา</TableColumn>
                            <TableColumn key="fix">รหัส</TableColumn>
                            <TableColumn key="fix">แจ้งปัญหา</TableColumn>
                        </TableHeader>
                        <TableBody items={items1}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                    <TableCell><Button fullWidth color="primary" onClick={() => { setDesc(item); setFix(false); setSMS(); onOpen(); }}>ดูรหัส</Button></TableCell>
                                    <TableCell><Button fullWidth color="danger" onClick={() => { setDesc(item); setFix(true); setSMS(); onOpen(); }}>{item.status_fix == 0 ? 'แจ้งปัญหา' : 'แจ้งปัญหาแล้ว'}</Button></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">เติมเกม</p>
                    </div>
                    <Table
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page2}
                                    total={pages2}
                                    onChange={(page) => setPage2(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="transaction_id">ORDER ID</TableColumn>
                            <TableColumn key="uid">บัญชีที่เติม</TableColumn>
                            <TableColumn key="company_name">เกม</TableColumn>
                            <TableColumn key="desc">รายการ</TableColumn>
                            <TableColumn key="price">ราคา</TableColumn>
                            <TableColumn key="time">เวลา</TableColumn>
                        </TableHeader>
                        <TableBody items={items2}>
                            {(item) => (
                                <TableRow key={item.transaction_id}>
                                    <TableCell>{item.transaction_id}</TableCell>
                                    <TableCell>{item.uid}</TableCell>
                                    <TableCell>{item.company_name}</TableCell>
                                    <TableCell><span dangerouslySetInnerHTML={{ __html: item.desc }} /></TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">ปั๊มไลค์</p>
                    </div>
                    <Table
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page4}
                                    total={pages4}
                                    onChange={(page) => setPage4(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="order">ORDER ID</TableColumn>
                            <TableColumn key="name">รายการ</TableColumn>
                            <TableColumn key="link">ลิงก์</TableColumn>
                            <TableColumn key="charge">ค่าบริการ</TableColumn>
                            <TableColumn key="start_count">เริ่มนับ</TableColumn>
                            <TableColumn key="status">สถานะ</TableColumn>
                        </TableHeader>
                        <TableBody items={items4}>
                            {(item) => (
                                <TableRow key={item.order}>
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="truncate max-w-sm">{item.link}</TableCell>
                                    <TableCell>{item.charge}</TableCell>
                                    <TableCell>{item.start_count}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex gap-5 h-12 justify-center">
                        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">อื่นๆ</p>
                    </div>
                    <Table
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page3}
                                    total={pages3}
                                    onChange={(page) => setPage3(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="desc">รายละเอียด</TableColumn>
                            <TableColumn key="time">เวลา</TableColumn>
                        </TableHeader>
                        <TableBody items={items3}>
                            {(item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.desc}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            }



            <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" อ isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                {!Fix ?
                                    Desc?.name.split(' ')[0] == 'Youtube' ? (
                                        <div className='text-center'>
                                            <p>Order ID : {Desc?.id}</p>
                                            {Desc?.password.includes('https://') ? (
                                                <>
                                                    <Link className='btn btn-danger w-100 mb-3' href={`https://${Desc?.password.split('href="//')[1].split('">')[0]}`}>กดรับสิทธิ์เข้าร่วมครอบครัว</Link>
                                                    <p>วันหมดอายุ : {Desc?.password.split('วันหมดอายุ →  ')[1].split('</p>')[0]}</p>
                                                </>
                                            ) : (
                                                <>

                                                    <p>Email : {Desc?.email}</p>
                                                    <p>Password : <span dangerouslySetInnerHTML={{ __html: Desc?.password }} /></p>
                                                </>
                                            )}
                                        </div>
                                    ) : Desc?.name.split(' ')[0] == 'Disney+' ?? Desc?.name.split(' ')[0] == 'TrueID+' ?? Desc?.name.split(' ')[0] == 'AIS' ?? Desc?.name.split(' ')[0] == 'BeinSports' ? (
                                        <>
                                            <p>Order ID : {Desc?.id}</p>
                                            <p>Email : {Desc?.email}</p>
                                            <p><Button color="primary" fullWidth onClick={() => smsotp()}>รับOTP</Button></p>
                                            {SMS && SMS?.map((d, i) => i == 0 && (
                                                <ul key={i}>
                                                    <li><p className="text-danger">หากข้อความไม่ใช่ล่าสุดกรุณารอสักครู่ ค่อยกดรับ OTP ใหม่</p></li>
                                                    <li><p>ข้อความจาก : {d?.sms}</p></li>
                                                    <li><p className="text-small">OTP : {d?.messenger}</p></li>
                                                    <li><p>เวลา : {d?.time}</p></li>
                                                </ul>
                                            ))}
                                            <p><span dangerouslySetInnerHTML={{ __html: Desc?.password.split('</button>')[1] }} /></p>
                                        </>
                                    ) : (
                                        <>
                                            <p>Order ID : {Desc?.id}</p>
                                            <p>Email : {Desc?.email}</p>
                                            <p>Password : <span dangerouslySetInnerHTML={{ __html: Desc?.password }} /></p>
                                        </>
                                    )
                                    :
                                    <form onSubmit={fix} className="flex flex-col gap-2">
                                        <h5 className="text-center">แจ้งปัญหา</h5>
                                        <p className="text-center">Order : {Desc?.id}</p>

                                        <Select
                                            label="เลือกปัญหา"
                                        >
                                            <SelectItem value='1'>รหัสผิดเข้าสู่ระบบไม่ได้</SelectItem>
                                            <SelectItem value='2'>จอหาย / PIN ผิด</SelectItem>
                                            <SelectItem value='3'>Netflix โดนมั่วจอ</SelectItem>
                                            <SelectItem value='4'>OTP เกินเวลา</SelectItem>
                                            <SelectItem value='5'>แก้จอเต็มอัตโนมัติ / (Netflix) (ระบบแก้ไขอัตโนมัติ ⌛1-5นาที)</SelectItem>
                                            <SelectItem value='6'>จอเต็มรับชมไม่ได้ (แอปอื่นๆ)</SelectItem>
                                            <SelectItem value='7'>Youtube Premium หลุด</SelectItem>
                                            <SelectItem value='8'>Youtube Premium ครอบครัวถูกปิดการใช้งาน</SelectItem>
                                            <SelectItem value='9'>Spotify Premium หลุด</SelectItem>
                                        </Select>
                                        <Button color="primary" type="submit">
                                            แจ้งปัญหา
                                        </Button>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            ปิด
                                        </Button>
                                        {/* <button type='submit' className='tf-button style-1 w-100 mt-4'></button> */}
                                    </form>
                                }
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

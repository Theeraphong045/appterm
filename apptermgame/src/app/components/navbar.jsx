"use client";

import Reac, { useState } from "react";
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Next_Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSetting, useAuth } from "../../../middleware/frontend";
import Cookies from "js-cookie";
import { navigate } from "../redirect";
import api from "../../../ess/api";

import Swal from "sweetalert2";
import { cn } from "./cn";

export default function Nav_Bar() {
    const router = useRouter()
    const pathname = usePathname()
    const { setting } = useSetting()
    const { user, isAuthenticated, update_user } = useAuth()
    const logout = async () => {
        await Cookies.remove('token', { path: '/' })
        await update_user()
        navigate('/')
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [ONS, setONS] = useState(false)
    const [oldpassword, setOldPassword] = useState()
    const [password, setPassword] = useState()
    const [confirm_password, setConfirm_Password] = useState()

    const [isVisible1, setIsVisible1] = useState(false);
    const toggleVisibility1 = () => setIsVisible1(!isVisible1);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const changepassword = async (e) => {
        e.preventDefault()
        setONS(true)
        await api.put('changepassword', {
            oldpassword,
            password
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
                });
                logout()
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
        setONS(false)
    }
    return (
        <>

            <Navbar
                classNames={{
                    base: cn("border-default-100", {
                        "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
                    }),
                    wrapper: "w-full justify-center",
                    item: "hidden md:flex",
                    item: "data-[active=true]:text-primary",
                }}
                height="60px"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
            >
                <NavbarBrand>
                    <Image src={setting?.logo || 'https://m1r.ai/9/ckxur.png'} width={34} className="mr-3" alt="Logo" />
                    <p className="ml-3 font-bold text-inherit">{setting?.title || 'RU6SU6.CLOUD'}</p>
                </NavbarBrand>

                <NavbarContent justify="end">
                    <div className="hidden md:flex gap-3">
                        <NavbarItem isActive={pathname === '/'}>
                            <Next_Link className="flex gap-2 text-inherit" href="/">
                                หน้าแรก
                            </Next_Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === '/termgame'}>
                            <Next_Link className="flex gap-2 text-inherit" href="/termgame">
                                เติมเกม
                            </Next_Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === '/app'}>
                            <Next_Link className="flex gap-2 text-inherit" href="/app">
                                แอปพรีเมียม
                            </Next_Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === '/like'}>
                            <Next_Link className="flex gap-2 text-inherit" href="/like">
                                เพิ่มไลค์
                            </Next_Link>
                        </NavbarItem>
                        {isAuthenticated &&
                            <>
                                <NavbarItem isActive={pathname === '/topup'}>
                                    <Next_Link className="flex gap-2 text-inherit" href="/topup">
                                        เติมเงิน
                                    </Next_Link>
                                </NavbarItem>
                                <NavbarItem isActive={pathname === '/history'}>
                                    <Next_Link className="flex gap-2 text-inherit" href="/history">
                                        ประวัติการสั่งซื้อ
                                    </Next_Link>
                                </NavbarItem>
                            </>
                        }
                        <NavbarItem>
                            <Next_Link className="flex gap-2 text-inherit" href={setting?.contact || '/'} target="_blank">
                                ติดต่อ
                            </Next_Link>
                        </NavbarItem>
                        {user?.permission > 0 &&
                            <NavbarItem isActive={pathname === '/backoffice'}>
                                <Next_Link className="flex gap-2 text-inherit" href="/backoffice">
                                    หลังบ้าน
                                </Next_Link>
                            </NavbarItem>
                        }
                    </div>
                    {!isAuthenticated ? <div className="hidden md:flex">
                        <NavbarItem isActive={pathname === '/auth/signin'} className="mx-2">
                            <Next_Link className="flex gap-2 text-inherit" href="/auth/signin">
                                เข้าสู่ระบบ
                            </Next_Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === '/auth/signup'} className="mx-2">
                            <Next_Link className="flex gap-2 text-inherit" href="/auth/signup">
                                สมัครสมาชิก
                            </Next_Link>
                        </NavbarItem>
                    </div> : <>
                        <NavbarItem className="px-2">
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <button className="h-8 w-8 outline-none transition-transform flex w-fit gap-2 items-center justify-center">
                                        <Icon
                                            icon="solar:user-circle-linear"
                                            width={24}
                                        />
                                        {user.credit} บาท
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-semibold">เข้าสู่ระบบโดย</p>
                                        <p className="font-semibold text-primary">{user?.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="history" onClick={() => router.push('/topup')}>เติมเงิน</DropdownItem>
                                    <DropdownItem key="history" onClick={() => router.push('/history')}>ประวัติ</DropdownItem>
                                    <DropdownItem key="changepassword" color="danger" onClick={() => onOpen()}>
                                        เปลี่ยนรหัสผ่าน
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={() => logout()}>
                                        ออกจากระบบ
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    </>}
                </NavbarContent>

                <NavbarMenuToggle className="text-foreground md:hidden" />

                <NavbarMenu
                    className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit pb-6 pt-6 shadow-medium backdrop-blur-sm backdrop-saturate-100 bg-default-100/50"
                    motionProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: {
                            ease: "easeInOut",
                            duration: 0.2,
                        },
                    }}
                >
                    {!isAuthenticated && <>
                        <NavbarMenuItem>
                            <Next_Link className="flex gap-2 text-inherit" href="/auth/signin">
                                <Button fullWidth color="primary">
                                    เข้าสู่ระบบ
                                </Button>
                            </Next_Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem className="mb-4">
                            <Next_Link className="flex gap-2 text-inherit" href="/auth/signin">
                                <Button fullWidth className="bg-foreground text-background">
                                    สมัครสมาชิก
                                </Button>
                            </Next_Link>
                        </NavbarMenuItem>
                    </>}
                    <NavbarMenuItem isActive={pathname === '/'}>
                        <Next_Link className="w-full" href="/">
                            หน้าแรก
                        </Next_Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem isActive={pathname === '/termgame'}>
                        <Next_Link className="w-full" href="/termgame">
                            เติมเกม
                        </Next_Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem isActive={pathname === '/app'}>
                        <Next_Link className="w-full" href="/app">
                            แอปพรีเมียม
                        </Next_Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem isActive={pathname === '/like'}>
                        <Next_Link className="w-full" href="/like">
                            เพิ่มไลค์
                        </Next_Link>
                    </NavbarMenuItem>
                    {isAuthenticated &&
                        <>
                            <NavbarMenuItem isActive={pathname === '/topup'}>
                                <Next_Link className="w-full" href="/topup">
                                    เติมเงิน
                                </Next_Link>
                            </NavbarMenuItem>
                            <NavbarMenuItem isActive={pathname === '/history'}>
                                <Next_Link className="w-full" href="/history">
                                    ประวัติการสั่งซื้อ
                                </Next_Link>
                            </NavbarMenuItem>
                        </>
                    }
                    <NavbarMenuItem>
                        <Next_Link className="w-full" href={setting?.contact || '/'} target="_blank">
                            ติดต่อ
                        </Next_Link>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
            <Modal className="border-small border-default-200/20 shadow-medium backdrop-blur-md backdrop-saturate-150 bg-default-100/50" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เปลี่ยนรหัสผ่าน</ModalHeader>
                            <form className="flex flex-col gap-5" onSubmit={changepassword}>
                                <ModalBody>
                                    <Input
                                        isRequired
                                        classNames={{
                                            base: "-mb-[2px]",
                                            inputWrapper:
                                                "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
                                        }}
                                        endContent={
                                            <button type="button" onClick={toggleVisibility1}>
                                                {isVisible1 ? (
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
                                        label="รหัสผ่านเก่า"
                                        name="password"
                                        type={isVisible1 ? "text" : "password"}
                                        variant="bordered"
                                        value={oldpassword}
                                        onChange={(e) => { setOldPassword(e.target.value) }}
                                        errorMessage={String(oldpassword).length < 8 && "รหัสผ่านต้องมีความยาว 8 ตัวอักษรขึ้นไป"}
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
                                        errorMessage={String(password).length < 8 && "รหัสผ่านต้องมีความยาว 8 ตัวอักษรขึ้นไป"}
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
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" color="primary" disabled={ONS}>เปลี่ยนรหัสผ่าน</Button>
                                    <Button color="danger" variant="light" type="button" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

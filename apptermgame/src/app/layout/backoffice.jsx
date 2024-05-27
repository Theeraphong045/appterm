'use client'
import React, { useEffect, useState } from 'react';
import { AdminRoute, useAuth, useSetting } from '../../../middleware/frontend';

import { Avatar, Button, ScrollShadow, Spacer, Tooltip, Image, Card, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from '../components/cn';

import { useRouter, usePathname } from 'next/navigation';

export default function Backoffice_Layout({ children }) {
    const { setting } = useSetting()
    const { user, isAuthenticated, update_user } = useAuth()
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const isCompact = isCollapsed || isMobile;

    const onToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);
    const router = useRouter()
    const pathname = usePathname()
    const [T, setT] = useState()
    useEffect(() => {
        switch (pathname) {
            case '/backoffice':
                setT('Dashboard')
                break
            case '/backoffice/termgame':
                setT('เติมเกม')
                break
            case '/backoffice/app':
                setT('แอปพรีเมี่ยม')
                break
            case '/backoffice/announce':
                setT('ประกาศ')
                break
            case '/backoffice/setting':
                setT('ตั้งค่าเว็บไซต์')
                break
            case '/backoffice/history':
                setT('ประวัติต่างๆ')
                break
        }
    }, [pathname])
    return (
        <AdminRoute>

            <div className="flex h-dvh w-full">
                <div
                    className={cn(
                        "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
                        {
                            "w-16 items-center px-2 py-6": isCompact,
                        },
                    )}
                >
                    <div
                        className={cn(
                            "flex items-center gap-3 px-3",

                            {
                                "justify-center gap-0": isCompact,
                            },
                        )}
                    >
                        <div className="flex h-8 w-8 items-center justify-center">
                            <Image src={setting?.logo || 'https://m1r.ai/9/ckxur.png'} width={34} className="mr-3" alt="Logo" />
                        </div>
                        <span
                            className={cn("text-small font-bold uppercase opacity-100", {
                                "w-0 opacity-0": isCompact,
                            })}
                        >
                            {setting?.title}
                        </span>
                    </div>
                    <Spacer y={8} />
                    <div className="flex items-center gap-3 px-3">
                        {/* <Avatar
                            isBordered
                            className="flex-none"
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                        /> */}

                        <Icon
                            icon="solar:user-circle-linear"
                            className="flex-none"
                            width={24}
                        />
                        <div className={cn("flex max-w-full flex-col pr-14", { hidden: isCompact })}>
                            <p className="truncate text-small font-medium text-default-600 truncate uppercase">{user?.email}</p>
                            <p className="truncate text-tiny text-default-400">{user?.permission == 1 ? 'แอดมิน' : user?.permission == 2 && 'เจ้าของ'}</p>
                        </div>
                    </div>
                    <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                        <div
                            className={cn("mt-auto flex flex-col", {
                                "items-center": isCompact,
                            })}
                        >
                            <Tooltip content="Dashboard" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                className="flex-none rotate-180 text-default-500"
                                                icon="solar:widget-3-linear"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            className="rotate-180 text-default-500"
                                            icon="solar:widget-3-linear"
                                            width={24}
                                        />
                                    ) : (
                                        "Dashboard"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="ประกาศ" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:translation-bold-duotone"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/announce')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:translation-bold-duotone"
                                            width={24}
                                        />
                                    ) : (
                                        "ประกาศ"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="เติมเกม" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:gamepad-linear"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/termgame')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:gamepad-linear"
                                            width={24}
                                        />
                                    ) : (
                                        "เติมเกม"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="แอปพรีเมี่ยม" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:clapperboard-open-play-linear"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/app')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:clapperboard-open-play-linear"
                                            width={24}
                                        />
                                    ) : (
                                        "แอปพรีเมี่ยม"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="ผู้ใช้" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:user-circle-linear"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/users')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:user-circle-linear"
                                            width={24}
                                        />
                                    ) : (
                                        "ผู้ใช้"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="ประวัติต่างๆ" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:history-line-duotone"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/history')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:history-line-duotone"
                                            width={24}
                                        />
                                    ) : (
                                        "ประวัติต่างๆ"
                                    )}
                                </Button>
                            </Tooltip>
                            {/* <Tooltip content="รับรหัสยืนยัน" isDisabled={!isCompact} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": isCompact,
                                    })}
                                    isIconOnly={isCompact}
                                    startContent={
                                        isCompact ? null : (
                                            <Icon
                                                icon="solar:verified-check-linear"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onClick={() => router.push('/backoffice/verify_nf')}
                                >
                                    {isCompact ? (
                                        <Icon
                                            icon="solar:verified-check-linear"
                                            width={24}
                                        />
                                    ) : (
                                        "รับรหัสยืนยัน"
                                    )}
                                </Button>
                            </Tooltip> */}
                            {user?.permission == 2 &&
                                <Tooltip content="ตั้งค่าเว็บไซต์" isDisabled={!isCompact} placement="right">
                                    <Button
                                        className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                            "justify-center": isCompact,
                                        })}
                                        isIconOnly={isCompact}
                                        startContent={
                                            isCompact ? null : (
                                                <Icon
                                                    icon="solar:settings-minimalistic-linear"
                                                    width={24}
                                                />
                                            )
                                        }
                                        variant="light"
                                        onClick={() => router.push('/backoffice/setting')}
                                    >
                                        {isCompact ? (
                                            <Icon
                                                icon="solar:settings-minimalistic-linear"
                                                width={24}
                                            />
                                        ) : (
                                            "ตั้งค่าเว็บไซต์"
                                        )}
                                    </Button>
                                </Tooltip>
                            }
                        </div>
                    </ScrollShadow>
                    <Spacer y={2} />
                    <div
                        className={cn("mt-auto flex flex-col", {
                            "items-center": isCompact,
                        })}
                    >
                        <Tooltip content="ออกจากหลังบ้าน" isDisabled={!isCompact} placement="right">
                            <Button
                                className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                    "justify-center": isCompact,
                                })}
                                isIconOnly={isCompact}
                                startContent={
                                    isCompact ? null : (
                                        <Icon
                                            className="flex-none rotate-180 text-default-500"
                                            icon="solar:minus-circle-line-duotone"
                                            width={24}
                                        />
                                    )
                                }
                                variant="light"
                                onClick={() => router.push('/')}
                            >
                                {isCompact ? (
                                    <Icon
                                        className="rotate-180 text-default-500"
                                        icon="solar:minus-circle-line-duotone"
                                        width={24}
                                    />
                                ) : (
                                    "ออกจากหลังบ้าน"
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="w-full flex-1 flex-col p-4">
                    <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
                        <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
                            {!isCompact ?
                                <Icon
                                    className="text-default-500"
                                    height={24}
                                    icon="solar:round-double-alt-arrow-left-linear"
                                    width={24}
                                />
                                :
                                <Icon
                                    className="text-default-500"
                                    height={24}
                                    icon="solar:round-double-alt-arrow-right-linear"
                                    width={24}
                                />
                            }
                        </Button>
                        <h2 className="text-medium font-medium text-default-700">{T}</h2>
                    </header>
                    {children}
                </div>
            </div>

        </AdminRoute>
    )
}

"use client";
import React from "react";
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
    Image
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Next_Link from "next/link";
export default function Termgame_item({ data }) {
    return (
        <Next_Link href={`/termgame/${data._id}`}>
            <div className="flex flex-col gap-2 justify-center items-center">
                <div className="relative flex justify-center items-center">
                    <Image
                        width='100%'
                        height='100%'
                        isZoomed
                        className="hover:cursor-pointer"
                        src={data.img || ''}
                        fallbackSrc="https://via.placeholder.com/200x200"
                        alt="Image Apps"
                    />
                    <div className="absolute bottom-[-5px]"><Badge isDot={true} content={`ลด ${data.price}%`} color="primary" /></div>
                </div>
                <p className="mt-2">{data.company_name}</p>

            </div>
        </Next_Link>
    );
}

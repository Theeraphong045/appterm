"use client";

import React, { useCallback } from "react";
import {
    Divider,
    Image
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { useSetting } from "../../../middleware/frontend";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function Footer() {
    const { setting } = useSetting()
    const data = [
        'wallet',
        'pp',
        'bbl',
        'kbank',
        'rbs',
        'ktb',
        'jpm',
        'mufg',
        'tmb',
        'scb',
        'citi',
        'smbc',
        'sc',
        'cimb',
        'uob',
        'bay',
        'mega',
        'boa',
        'cacib',
        'gsb',
        'hsbc',
        'db',
        'ghb',
        'baac',
        'mb',
        'tbank',
        'bnp',
        'ibank',
        'tisco',
        'kk',
        'icbc',
        'tcrb',
        'lhb',
        'ttb',
    ]
    return (
        <div className="flex w-full flex-col sticky top-[100vh] justify-center items-center pt-16 sm:pt-24 lg:pt-32">
            {/* <div className="relative">
                <div className="absolute z-10 w-full flex flex-col justify-center items-center h-full">
                    <p className="text-4xl text-white"><strong>ระบบเติมเงินอัตโนมัติ</strong></p>
                    <p className="text-white">สะดวก รวดเร็ว ปลอดภัย ตลอด 24 ช.ม.</p>
                    <div className="container h-24 w-full mt-4">
                        <Swiper
                            cssMode={true}
                            navigation={false}
                            pagination={false}
                            mousewheel={true}
                            keyboard={true}
                            modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
                            slidesPerView={4}
                            className="w-full h-full"
                            // slidesPerView={'auto'}
                            spaceBetween={30}
                            // centeredSlides={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                        >
                            {data.map((d, i) => (
                                <SwiperSlide className="flex justify-center items-center mx-1" key={i}>
                                    <Image
                                        src={`/icon-bank/${d}.png`}
                                        alt={d}
                                        style={{ height: '70px' }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                <Image src="/footer.png" className="z-0" alt="alt" radius="none" />
            </div> */}
            <footer className="flex w-full flex-col sticky justify-center items-center container mx-auto">
                <div className="px-6 pb-8 pt-16 lg:px-8 w-full">
                    {/* <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8 md:pr-8">
                            <div className="flex items-center justify-start">
                                <Image src={setting?.logo || '/logo.png'} width={150} className="mr-3" alt="Logo" />
                            </div>
                            <p className="text-small text-default-500">
                                {setting?.desc}
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                            <div>
                                <h3 className="text-small font-semibold text-default-600">ติดต่อเรา</h3>
                                <div className="mt-6 space-y-4 flex flex-col">
                                    <Link href={setting?.contact || '/'} target="_blank" className="text-xl text-primary">Facebook</Link>
                                    <Link href='https://lin.ee/I9FtClt' target="_blank" className="text-xl text-primary">Line</Link>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-small font-semibold text-default-600">ติดต่อเรา</h3>
                                <div className="mt-6 space-y-4">
                                    <iframe src={`https://www.facebook.com/plugins/page.php?href=${setting?.contact || '/'}&tabs=timeline&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1190670275220690`} width="100%" height='100%' scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <Divider className="mt-16" />
                    <div className="flex flex-wrap justify-between gap-2 pt-8">
                        <p className="text-small text-default-400">&copy; 2024 {setting?.domain?.toUpperCase()} Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div >
    );
}

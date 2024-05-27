"use client";
import React from "react";
import { Image } from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
export default function Slid({ data }) {
    return (
        <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            // slidesPerView={3}
            className="w-full"
        >
            {data.map((d, i) => (
                <SwiperSlide key={i} style={{ background: 'transparent' }}>
                    <Image
                        src={d.image}
                        fallbackSrc="https://via.placeholder.com/1344x350"
                        alt={d.title}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}


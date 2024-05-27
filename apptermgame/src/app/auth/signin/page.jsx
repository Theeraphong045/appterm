"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Divider, Image, Chip, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import api from "../../../../ess/api";
import { useSetting, useAuth } from "../../../../middleware/frontend";
import { uploadFile } from 'ru6su6.dev'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'
import Swal from "sweetalert2";

export default function Install() {
  const turnstile = useTurnstile();
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { setting, update_setting } = useSetting()
  const { update_user, isAuthenticated } = useAuth()

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [ons, setONS] = useState(false)
  const [Token, setToken] = useState()

  const submit = async (e) => {
    e.preventDefault()
    setONS(true)
    await api.post('auth/signin', {
      username,
      password,
      Token
    })
      .then(async (d) => {
        await Cookies.set('token', d.data.token, { expires: 1 })
        Swal.fire({
          title: "สำเร็จ!",
          text: d.data.msg,
          icon: "success",
          confirmButtonColor: '#802eec'
        });
        await update_user()
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: err.response?.data.msg || err.message,
          icon: "error",
          confirmButtonColor: '#802eec'
        });
        turnstile.reset()
      })
    setONS(false)
  }
  return isAuthenticated ? router.push('/') : (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Image src={setting?.logo} width={60} className="mr-3" alt="Logo" />
          <p className="text-xl font-medium">เข้าสู่ระบบ</p>
          <p className="text-small text-default-500">Signin</p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <div className="flex flex-col gap-3">
            <Input
              isRequired
              classNames={{
                base: "-mb-[2px]",
                inputWrapper:
                  "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
              }}
              label="ชื่อผู้ใช้"
              name="username"
              type="text"
              variant="bordered"
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
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

            <Turnstile
              className="Turnstile"
              sitekey={process.env.NEXT_PUBLIC_CF_Key}
              onVerify={(token) => setToken(token)}
              theme="dark"
            />
          </div>
          <Button color={!ons ? 'primary' : 'default'} disabled={ons} type="submit">
            {!ons ? 'เข้าสู่ระบบ' : <><Spinner size="sm" />กำลังเข้าสู่ระบบ</>}
          </Button>
        </form>
        <p className="text-center text-small">
          ยังไม่มีบัญชี;
          <Link href="/auth/signup" className="text-primary" size="sm">
            สมัคร
          </Link>
        </p>
      </div>
    </div>
  );
}

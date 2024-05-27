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
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const { setting, update_setting } = useSetting()
  const { update_user, isAuthenticated } = useAuth()

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirm_password, setConfirm_Password] = useState()
  const [ons, setONS] = useState(false)
  const [Token, setToken] = useState()

  const submit = async (e) => {
    e.preventDefault()
    setONS(true)
    await api.post('auth/signup', {
      username,
      email,
      password,
      Token
    })
      .then(async (d) => {
        Swal.fire({
          title: "สำเร็จ!",
          text: d.data.msg,
          icon: "success",
          confirmButtonColor: '#802eec'
        });
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
          <p className="text-xl font-medium">สมัครสมาชิก</p>
          <p className="text-small text-default-500">Signup</p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={submit}>
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
            label="อีเมล"
            type="email"
            name="email"
            variant="bordered"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
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
              inputWrapper: "rounded-none",
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

          <Turnstile
            className="Turnstile"
            sitekey={process.env.NEXT_PUBLIC_CF_Key}
            onVerify={(token) => setToken(token)}
            theme="light"
          />
          <Button color={!ons ? 'primary' : 'default'} disabled={ons} type="submit">
            {!ons ? 'สมัครสมาชิก' : <><Spinner size="sm" />กำลังสมัครสมาชิก</>}
          </Button>
        </form>
        <p className="text-center text-small">
          มีบัญชีแล้ว;
          <Link href="/auth/signin" className="text-primary" size="sm">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client'
import { NextUIProvider } from '@nextui-org/react'
import Navbar from './components/navbar'
import { run } from 'ru6su6.dev'
import { AuthProvider, SettingProvider } from '../../middleware/frontend'

import { usePathname } from 'next/navigation'
import Footer from './components/footer'
import Backoffice_Layout from './layout/backoffice'

export function Providers({ children }) {
    const pathname = usePathname()
    run()
    return (
        <SettingProvider>
            <AuthProvider>
                <NextUIProvider>
                    {pathname.includes('backoffice') ?
                        <Backoffice_Layout>
                            {children}
                        </Backoffice_Layout>
                        :
                        <div className='min-h-screen'>
                            <Navbar />
                            <div className="container mx-auto py-10">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    }
                </NextUIProvider>
            </AuthProvider>
        </SettingProvider>
    )
}
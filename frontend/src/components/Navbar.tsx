import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className='h-20 flex items-center p-4 justify-between backdrop-blur-3xl text-slate-200 bg-transparent absolute z-50 w-full top-0'>
        <Link href={'/'} >
            <Image priority src={'/logo.svg'} alt='Logo' height={200} width={200} />
        </Link>
        <div>
          <ConnectButton  />
        </div>

    </nav>
  )
}

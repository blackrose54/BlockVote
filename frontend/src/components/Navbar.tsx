import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

export default function Navbar() {
  return (
    <nav className=' flex items-center p-4 justify-between backdrop-blur-3xl text-slate-200 bg-transparent absolute z-50 w-full top-0'>
        <div>
            Logo
        </div>
        <div>
            <ConnectButton showBalance={false}  />
        </div>

    </nav>
  )
}

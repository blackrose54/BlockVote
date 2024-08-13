"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight } from "lucide-react";
import { useAccount } from 'wagmi'
import { useRouter } from "next/navigation";

export default function Home() {
  const account = useAccount();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4"
    >
      <div className=" text-5xl md:text-7xl font-bold text-white text-center">
        Block<span className=" text-sky-400">Vote</span>
      </div>
      <div className="font-extralight text-center md:w-[60%] text-2xl md:text-4xl text-neutral-200 py-4">
        Secure, transparent voting powered by blockchain technology for
        trusted democratic elections.
      </div>
      <div className=" flex items-center gap-x-3">
        <ConnectButton  showBalance={false} />
          <button onClick={()=>{
            if(account.address){
              router.push('/elections')
            }else{
              alert('Connect your wallet')
            }
          }} className=" px-4 py-2 rounded-xl border-2 text-white flex gap-x-1 hover:gap-x-2 transition-all hover:scale-105 items-center">
            <p>Vote</p>
            <ArrowRight size={20} />
          </button>
      </div>
    </motion.div>
  );
}

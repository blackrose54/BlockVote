"use client";

import SearchBar from "@/components/SearchBar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import React, { FC, ReactElement, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { votingAbi } from "@/lib/abis";
import { votingAddress } from "@/lib/address";
import { Loader2 } from "lucide-react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { redirect } from "next/navigation";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const account = useAccount();

  useEffect(() => {
    if (account.isDisconnected) redirect("/");
  }, []);

  const { data, isLoading, isError, error } = useReadContract({
    functionName: "getActiveElections",
    address: votingAddress,
    abi: votingAbi,
    account: account.address,
  });

  if (isError) {
    console.log({ error });
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Something went wrong!
      </div>
    );
  }

  return (
    <div className="h-screen bg-black w-full relative flex items-center justify-center">
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ opacity: 1, width: 320 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeOut",
        }}
        className=" space-y-4 relative text-slate-200 z-10 "
      >
        <SearchBar />
        <div className=" h-[20rem] items-center justify-center flex overflow-y-auto rounded-md bg-neutral-950 border-2 border-slate-500">
          {!isLoading ? (
            data && data.length > 0 ? (
              <div>
                {data.map((election) => (
                  <div key={election.id} className=" flex items-center gap-x-4">
                    <p>{election.name}</p>
                    <p>{election.chairman}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className=" text-2xl font-thin">No Elections</div>
            )
          ) : (
            <div className=" w-full h-full flex items-center justify-center">
              <Loader2 className=" animate-spin" />
            </div>
          )}
        </div>
        <button className="p-[3px] w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Create New Election
          </div>
        </button>
      </motion.div>
      <BackgroundBeams />
    </div>
  );
};

export default Page;

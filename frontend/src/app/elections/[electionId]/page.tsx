"use client";

import { votingAbi } from "@/lib/abis";
import { votingAddress } from "@/lib/address";
import { Loader2 } from "lucide-react";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

function Election({
  params: { electionId },
}: {
  params: { electionId: string };
}) {
  const { address } = useAccount();

  const { data, isLoading, isError, error, status } = useReadContract({
    abi: votingAbi,
    account: address,
    address: votingAddress,
    functionName: "electionsArray",
    args: [BigInt(electionId)],
  });

  if (status == "pending")
    return (
      <div className=" h-full w-full justify-center flex items-center text-white">
        <Loader2 className=" animate-spin" size={40} />
      </div>
    );

  return (
    <div className="h-full w-full text-slate-200 z-10 pt-20">
      <div className=" container mx-auto">
        Search
      </div>
    </div>
  );
}

export default Election;

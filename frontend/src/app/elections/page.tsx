"use client";

import { Input } from "@/components/Input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { votingAbi } from "@/lib/abis";
import { votingAddress } from "@/lib/address";
import { motion } from "framer-motion";
import { Loader2, PlusIcon } from "lucide-react";
import { FC, ReactElement, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Election } from "@/lib/types";
import Link from "next/link";

const Status = ["Created", "Registration", "Election", "Result", "Over"];

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const account = useAccount();

  const [search, setsearch] = useState<string>("");
  const [elections, setelections] = useState<Election[] | undefined>();

  // useEffect(() => {
  //   if (account.isDisconnected) redirect("/");
  // }, [account.isDisconnected]);

  const {
    data: txhash,
    writeContract,
    isPending,
    isError: txisError,
    error: txerror,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txhash,
    });

  const { data, isLoading, isError, error, refetch, isSuccess } =
    useReadContract({
      functionName: "getActiveElections",
      address: votingAddress,
      abi: votingAbi,
      account: account.address,
    });

  useEffect(() => {
    if (isConfirmed) {
      console.log("refetch");
      refetch();
    }
  }, [isConfirmed, refetch]);

  useEffect(() => {
    if (txisError) {
      console.log(txerror);
      alert(txerror.cause);
    }
  }, [txerror, txisError]);

  useEffect(() => {
    setelections(data ? [...data] : undefined);
  }, [isSuccess, data]);

  useEffect(() => {
    if (search) {
      setelections(() => {
        const newele = data?.filter((val) => {
          return (
            val.id.toString() == search ||
            val.chairman == search ||
            val.name.includes(search)
          );
        });
        return newele;
      });
    } else {
      setelections(data ? [...data] : undefined);
    }
  }, [search]);

  if (isError) {
    console.log({ error });
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Something went wrong!
      </div>
    );
  }

  const createElection = async () => {
    if (search.length == 0) {
      return alert("Election name is Required");
    }

    if (search.length > 10) {
      return alert("Election name should be less than 10 characters");
    }

    writeContract({
      address: votingAddress,
      abi: votingAbi,
      functionName: "createElection",
      args: [search],
    });
  };

  return (
    <div className="h-screen w-full relative pt-24 space-y-4 overflow-auto">
      <div className="z-10 relative flex items-center justify-center  px-2">
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "100%" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: "easeIn",
          }}
          className=" flex items-center justify-center gap-x-4"
        >
          <Input
            placeholders={[
              "Search Election by Id",
              "Search Election by Name",
              "Search Election by chairman",
              "Create new Election",
            ]}
            onChange={(e) => setsearch(e.target.value)}
            onSubmit={(val) => {
              val.preventDefault();
              setsearch("");
            }}
          />
          <button
            className="p-[3px] relative "
            onClick={createElection}
            disabled={isPending || isConfirming}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 rounded-[6px] flex items-center justify-center relative group transition duration-200  text-white hover:bg-transparent">
              {isPending || isConfirming ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <p className=" max-sm:hidden text-nowrap">
                    Create New Election
                  </p>
                  <PlusIcon className=" sm:hidden" />
                </>
              )}
            </div>
          </button>
        </motion.div>
      </div>
      <div className=" space-y-4 relative text-slate-200 z-10 w-full ">
        {!isLoading ? (
          elections && elections.length > 0 ? (
            <div className=" w-full h-full py-4 px-8 grid grid-cols-1 grid-flow-row sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 overflow-y-auto">
              {elections.map((election) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.2,
                      duration: 0.1,
                      ease: "easeIn",
                    }}
                    key={Number(election.id)}
                    className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start  max-w-xs p-4 relative h-[25rem] gap-y-2 bg-neutral-950  z-20 "
                  >
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                    
                      <EvervaultCard id={Number(election.id)} text={election.name} className=" cursor-pointer" />

                    <p className=" space-x-2 ">
                      <span className=" font-bold">Election Id:</span>
                      <span>{election.id.toString()}</span>
                    </p>
                    <p className=" space-x-2 ">
                      <span className=" font-bold">Election Status:</span>
                      <span>{Status[election.status]}</span>
                    </p>
                    <div className="dark:text-white w-full text-black space-x-2 font-light">
                      <span className=" font-bold">Chairman:</span>
                      <span className=" text-sm break-words ">
                        {election.chairman}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className=" text-2xl font-thin w-full text-center p-8">
              No Elections
            </div>
          )
        ) : (
          <div className=" w-full h-full flex items-center justify-center">
            <Loader2 className=" animate-spin" />
          </div>
        )}
      </div>
      {/* <BackgroundBeams /> */}
    </div>
  );
};

export default Page;

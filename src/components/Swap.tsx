'use client'

import React, { useState, useEffect } from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import { abiContract } from "../utils/SwapABI.json"
import { abiToken } from "../utils/Token1.json"
import Swal from 'sweetalert2'

export function Swapper(){
    const [step, setStep] = useState(0)
    const [amountToMint, setAmountToMint] = useState<Number>()
    const [amountToSwap, setAmountToSwap] = useState<Number>()
    const [amountToSwapReal, setAmountToSwapReal] = useState<Number>(1)
    const [amountFromContract, setAmountFromContract] = useState<Number>()

    const { data: readData, isLoading: readLoading, isError: readError } = useContractRead({
        address: '0x0F0B4B1219d66860E6bD37920EfFFEbAea33A174',
        abi: abiContract,
        functionName: 'getPrice',
        args: [amountToSwap],
    })

    const { data: writeData0, isLoading: writeLoading0, isSuccess: writeSuccess0, isError: writeError0, write: writeFunction0 } = useContractWrite({
        address: '0x57CbcC857bE1126CBa3e2E20BDe48a55282ec794',
        abi: abiToken,
        functionName: 'receiveToken',
        args: [amountToMint]
    })

    const { data: writeData1, isLoading: writeLoading1, isSuccess: writeSuccess1, isError: writeError1, write: writeFunction1 } = useContractWrite({
        address: '0x57CbcC857bE1126CBa3e2E20BDe48a55282ec794',
        abi: abiToken,
        functionName: 'approve',
        args: ['0x0F0B4B1219d66860E6bD37920EfFFEbAea33A174', amountToSwapReal]
    })

    const { data: writeData2, isLoading: writeLoading2, isSuccess: writeSuccess2, isError: writeError2, write: writeFunction2 } = useContractWrite({
        address: '0x0F0B4B1219d66860E6bD37920EfFFEbAea33A174',
        abi: abiContract,
        functionName: 'swap',
        args: [amountToSwap]
    })

    function preprareApprove(e : any) {
        setAmountToSwap(Number(e.target.value))
        setAmountToSwapReal(Number(e.target.value) * 10**18)
    }

    function success() {
        setStep(step + 1)
        Swal.fire({
            title: "Transaction completed!",
            icon: "success",
            showCloseButton: true,
            allowEscapeKey: true,
            confirmButtonText: "Continue",
        })
    }

    function success2() {
        Swal.fire({
            title: "You have successfully swapped!",
            text: `Transaction: ${JSON.stringify(writeData2)}`,
            icon: "success",
            showCloseButton: true,
            allowEscapeKey: true,
            confirmButtonText: `<a href="/">Ok</a>`,
        })
    }

    function loading() {
        Swal.fire({
            title: "Waiting for the transaction",
            icon: "question",
            showConfirmButton: false,
        })
    }

    function error() {
        Swal.fire({
            title: "Oops!",
            text: "Oh it seems there was an error...",
            icon: "error",
            showCloseButton: true,
            allowEscapeKey: true,
            confirmButtonText: `<a href="/">Cancel</a>`,
        })
    }

    useEffect(() => {
        if (readData !== null && readData !== undefined) {
            setAmountFromContract(Number(readData) / 10**18)
        }
    }, [readData])

    return(
        <div className={`flex items-center w-screen ${step === 2 ? "mt-44" : "mt-56"}`}>
            <div className='border-2 rounded-lg shadow w-1/3 mx-auto'>
                {step === 0 && (
                    <div className='py-4'>
                        <h2 className='text-xl text-center font-semibold'>
                            Put in the amount of Token1 you need
                        </h2>
                        <div className='flex justify-center gap-2 my-2'>
                            <input 
                                type='number' 
                                onChange={ (e) => setAmountToMint(Number(e.target.value)) } 
                                className='border-2 rounded pl-2' />
                            <button 
                                type='button' 
                                onClick={ () => writeFunction0() }
                                className='border-2 rounded-lg bg-green-500 px-4 py-1 hover:bg-green-400'>
                                    Mint
                            </button>
                        </div>
                        <>
                            {writeLoading0 && (
                                loading()
                            )}
                            {writeSuccess0 && (
                                success()
                            )}
                            {writeError0 && (
                                error()
                            )}
                        </>
                    </div>
                )}

                {step === 1 && (
                    <div className='py-4'>
                        <h2 className='text-xl text-center font-semibold mx-3'>
                            Put in the amount of Token1 you want to swap for some Token2
                        </h2>
                        <div className='flex justify-center gap-2 my-2'>
                            <input 
                                type='number' 
                                onChange={ (e) => preprareApprove(e) } 
                                className='border-2 rounded pl-2' />
                            <button 
                                type='button' 
                                onClick={ () => writeFunction1() }
                                className='border-2 rounded-lg bg-green-500 px-4 py-1 hover:bg-green-400'>
                                    Approve
                            </button>
                        </div>
                        {amountFromContract !== undefined && 
                            <p className='text-center'>Amount of Token2: {amountFromContract?.toString()}</p>
                        }
                        
                        <>
                            {writeLoading1 && (
                                loading()
                            )}
                            {writeSuccess1 && (
                                success()
                            )}
                            {writeError1 && (
                                error()
                            )}
                        </>
                    </div>
                )}

                {step === 2 && (
                    <div className='py-4 mx-auto'>
                        <h2 className='text-xl text-center font-semibold'>
                            Here are the infos of the swap
                        </h2>
                        <div className="bg-gray-200 p-4 rounded-lg mx-4 my-4">
                            <ul className="list-disc pl-4">
                                <li><p className="mb-2">Token 1: <span className="font-bold">0x57CbcC857bE1126CBa3e2E20BDe48a55282ec794</span></p></li>
                                <li><p className="mb-2">Amount: <span className="font-bold">{amountToMint?.toString()}</span></p></li>
                                <li><p className="mb-2">Token 2: <span className="font-bold">0x83B208434Ba2836416FE634CA66081f6A0b0e2D4</span></p></li>
                                <li><p className="mb-2">Amount: <span className="font-bold">{amountFromContract?.toString()}</span></p></li>
                            </ul>
                        </div>
                        <div className='flex justify-center'>
                            <button 
                                type='button' 
                                onClick={ () => writeFunction2() }
                                className='border-2 rounded-lg bg-green-500 px-14 py-2 hover:bg-green-400'>
                                    Swap
                            </button>
                        </div>

                        <>
                            {writeLoading2 && (
                                loading()
                            )}
                            {writeSuccess2 && (
                                success2()
                            )}
                            {writeError2 && (
                                error()
                            )}
                        </>
                    </div>
                )}
            </div>
        </div>
    )
}
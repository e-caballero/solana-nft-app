import React, {useEffect, useState} from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
    useClaimNFT,
    useLogin,
    useLogout,
    useProgram,
    useUser,
    useDropUnclaimedSupply,
    useNFTs,
} from "@thirdweb-dev/react/solana"
import { wallet } from "./_app"
import { useRouter } from "next/router"
import { CONTRACT_ADDRESSES, NFT } from "@thirdweb-dev/sdk"
import Link from "next/link"
import Image from "next/image"

function LoginPage() {
    const [usersNft, setUsersNft] = useState<NFT | undefined>()
    const login = useLogin()
    const logout = useLogout()
    const router = useRouter()
    const { user } = useUser()
    const { publicKey, connect, select } = useWallet()
    const paddress = "3iDqUgevhk1yUEPDmHQz5DHnFkufT5gyo4iq8dhWgAex"
    const { program } = useProgram(
        paddress,
        "nft-drop"
    )
console.log("contract address:", process.env.PRIVATE_KEY!)
        const {data: UnclaimedSupply} = useDropUnclaimedSupply(program)
        const {data: nfts, isLoading} = useNFTs(program)
        const {mutateAsync: claim} = useClaimNFT(program)

        useEffect (() => {
            if (!publicKey){
                select(wallet.name)
                connect()
            }
        }, [publicKey, wallet])

        useEffect(() => {
            if(!user || !nfts) return

            const usersNft = nfts.find((nft) => nft.owner === user?.address)

            if (usersNft) {
                setUsersNft(usersNft)
            }
        }, [nfts, user])
 
        const handleLogin = async () => {
            await login()
            router.replace("/")
        }

        const handlePurchase = async () => {
            await claim({
                amount: 1,
            })
            router.replace("/")
        }

    return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#241c0b]">
        <div className="absolute left-0 z-10 w-full overflow-hidden -skew-y-6 bg-blue-900 shadow-xl top-56 h-1/4" />
            <Image
                className="z-30 mt-5 mb-10 rounded-full shadow-2xl shrink"
                src="https://lalatinadev.blob.core.windows.net/publicimages/LoLatinaLogo.png"
                alt="logo"
                width={400}
                height={400}
            />

            <main className="z-30 text-white">
                <h1 className="text-4xl font-bold uppercase">
                    Welcome to the <span className="text-blue-900">LaLatina Club</span>
                </h1>

                {!user && (
                    <div className="items-center">
                        <button onClick={handleLogin} className="items-center px-10 py-4 mt-5 mb-5 text-2xl font-bold text-white transition duration-200 bg-blue-900 border-2 rounded-md border-fusb-blue-900 animate-pulse">
                        Login / Connect Wallet
                        </button>
                    </div>
                )}
                
                {user && (
                    <div>
                        <p className="mb-10 text-lg font-bold text-blue-900">
                            Welcome {user.address.slice(0,5)}...{user.address.slice(-5)}
                        </p>

                        {isLoading &&(
                            <div className="px-10 py-4 mb-5 text-2xl font-bold text-white transition duration-200 bg-blue-900 border-2 rounded-md border-fusbg-blue-900 animate-pulse">
                                Hold on, We're looking up your LaLatina Membership pass...
                            </div>
                        )}

                        {usersNft && (
                            <Link href="/login"
                                className="px-10 py-4 mt-5 mb-5 text-2xl font-bold text-white uppercase transition duration-200 bg-blue-900 border-2 rounded-md border-fusbg-blue-900 animate-pulse hover:bg-white hover:text-blue-900">
                                Membership verified, thank you for being a member and supporting La Latino movement
                            </Link>
                        )}

                        {!usersNft &&
                            !isLoading &&
                            (UnclaimedSupply && UnclaimedSupply > 0 ? (
                                <button onClick={handlePurchase}
                                        className="px-10 py-4 mt-5 font-bold text-white uppercase transition duration-200 border-2 border-blue-900 rounded-md bg-fu hover:bg-white hover:text-blue-900">
                                            Buy a LaLatina Membership Pass</button>
                            ):(
                                <p className="px-10 py-4 mb-5 text-2xl font-bold text-white uppercase transition duration-200 bg-red-500 border-2 border-red-500 rounded-md">
                                    Sorry, we're all out of LaLatina Membership passes!
                                </p>
                            ))
                        }
                    </div>
                )}

                {user && (
                    <button onClick={logout}
                            className="px-10 py-4 mt-10 font-bold text-blue-900 uppercase transition duration-200 bg-white border-2 border-blue-900 rounded-md hover:bg-blue-900 hover:text-white"
                    >
                        logout
                    </button>
                )}

            </main>
        
    </div>
        
    )
}

export default LoginPage
import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana'
import { useLogout } from "@thirdweb-dev/react/solana"
import type { GetServerSideProps } from 'next'
import { getUser } from '../auth.config'
import Image from 'next/image'
import { network } from './_app'
import Link from 'next/link'


export const getServerSideProps: GetServerSideProps = async ({ req, res}) => {
  const sdk = ThirdwebSDK.fromNetwork(network)
  const user= await getUser(req)

  if(!user)
    return{
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }

        //Check if user has the NFT and then allow access
        const program = await sdk.getNFTDrop (
          process.env.LALATINA_ADDRESS!
        )
      const nfts = await program.getAllClaimed()
      const nft = nfts.find((nft) => nft.owner === user.address) 
    
      if(!nft)
          return{
            redirect: {
              destination: "/login",
              permanent: false
            }
          }
    
          return {
            props: {},
          }
    

}

const Home = () => {
  return 
  (
    <div>blank</div>
  )
}

export default Home

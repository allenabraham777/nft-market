import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="An NFT Marketplace over Rinkeby Network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="text-app-primary">NFT Marketplace</h1>
      </div>
    </div>
  )
}

export default Home

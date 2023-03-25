import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();
  // ENS
  const [ens, setENS] = useState("");
  // Save the address of the currently connected account
  const [address, setAddress] = useState("");

  /**
   * Sets the ENS, if the current connected address has an associated ENS or else it sets
   * the address of the connected account
   */
  const setENSOrAddress = async (address, web3Provider) => {
    // Lookup the ENS related to the given address
    var _ens = await web3Provider.lookupAddress(address);
    // If the address has an ENS set the ENS or else just set the address
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  /**
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   */
  const getProviderOrSigner = async () => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    // Get the address associated to the signer which is connected to  MetaMask
    const address = await signer.getAddress();
    // Calls the function to set the ENS or Address
    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  );
}





































































// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={styles.main}>
//         <div className={styles.description}>
//           <p>
//             Get started by editing&nbsp;
//             <code className={styles.code}>pages/index.js</code>
//           </p>
//           <div>
//             <a
//               href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               By{' '}
//               <Image
//                 src="/vercel.svg"
//                 alt="Vercel Logo"
//                 className={styles.vercelLogo}
//                 width={100}
//                 height={24}
//                 priority
//               />
//             </a>
//           </div>
//         </div>

//         <div className={styles.center}>
//           <Image
//             className={styles.logo}
//             src="/next.svg"
//             alt="Next.js Logo"
//             width={180}
//             height={37}
//             priority
//           />
//           <div className={styles.thirteen}>
//             <Image
//               src="/thirteen.svg"
//               alt="13"
//               width={40}
//               height={31}
//               priority
//             />
//           </div>
//         </div>

//         <div className={styles.grid}>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Docs <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Find in-depth information about Next.js features and&nbsp;API.
//             </p>
//           </a>

//           <a
//             href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Learn <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Learn about Next.js in an interactive course with&nbsp;quizzes!
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Templates <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Discover and deploy boilerplate example Next.js&nbsp;projects.
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Deploy <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Instantly deploy your Next.js site to a shareable URL
//               with&nbsp;Vercel.
//             </p>
//           </a>
//         </div>
//       </main>
//     </>
//   )
// }

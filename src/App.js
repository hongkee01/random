import { useEffect, useState } from 'react';
import './App.css';
import contractERC721 from './contracts/PixelTigers.json';
import contractERC20 from './contracts/PixelERC20.json';
import { ethers } from 'ethers';

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();

const contractAddressERC721 = "0x5760eDC9948A9A629581a4549546e4cA696B718F";
const abiERC721 = contractERC721.abi;
const nftContractERC721 = new ethers.Contract(contractAddressERC721, abiERC721, signer);

const contractAddressERC20 = "0x92F858C2B1f6CA874C1a41faE021Fa2bF03c9A55";
const abiERC20 = contractERC20.abi;
const nftContractERC20 = new ethers.Contract(contractAddressERC20, abiERC20, signer);


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  //mint function
  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log("Initialize payment");
        //the value 1 has to be changed with user input of how many he wants to mint, value has to be: that statement *input
        let nftTxn = await nftContractERC721.mint(1 , { value: ethers.utils.parseEther("0.06") });
        //let nftTxn = await nftContractERC721.presaleMint(1 , { value: ethers.utils.parseEther("0.06") });
        //let nftTxn = await nftContractERC721.reserveMint(1 , { value: ethers.utils.parseEther("0.06") });
        console.log("Mining... please wait");
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const claimPixel = async () => {
    try{
      const { ethereum } = window;
      if (ethereum) {
        console.log("claiming $pixel");
        let nftTxn = await nftContractERC20.claimReward();
        console.log("claiming...")
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const enterRaffle = async () => {
    try{
      const { ethereum } = window;
      if (ethereum) {
        console.log("entering raffle");
        //please read PixelsERC20 code to understand the function; enterMainRaffle(numtickets)
        let nftTxn = await nftContractERC20.enterMainRaffle(1);
        console.log("claiming...")
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  //there should also be an input place before mint button to ask how many they want to mint, max of 2
  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  const claimRewardButton = () => {
    return (
      <button onClick={claimPixel} className='cta-button claim-reward-button'>
        claim
      </button>
    )
  }

  const enterRaffleButton = () => {
    return (
      <button onClick={enterRaffle} className='cta-button enter-raffle-button'>
        enter
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <div>
        {enterRaffleButton()}
      </div>
      <div>
        {claimRewardButton()}
      </div>
    </div>
  )
}

export default App;

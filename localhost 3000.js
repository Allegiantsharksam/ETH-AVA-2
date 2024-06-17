import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  useEffect(() => {
    const getWallet = async () => {
      if (window.ethereum) {
        setEthWallet(window.ethereum);
        const account = await window.ethereum.request({ method: "eth_accounts" });
        if (account.length) setAccount(account[0]);
      }
    };

    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet && account) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const signer = provider.getSigner();
      setATM(new ethers.Contract(contractAddress, atmABI, signer));
    }
  }, [ethWallet, account]);

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    if (accounts.length) setAccount(accounts[0]);
  };

  const getBalance = async () => {
    if (atm) setBalance((await atm.getBalance()).toNumber());
  };

  useEffect(() => {
    if (atm) getBalance();
  }, [atm]);

  const handleTransaction = async (action) => {
    if (atm) {
      const tx = await atm ;
      await tx.wait();
      getBalance();
    }
  };

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {!ethWallet ? (
        <p>Please install Metamask in order to use this ATM.</p>
      ) : !account ? (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      ) : (
        <div>
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance}</p>
          <button onClick={() => handleTransaction("deposit")}>Deposit 1 ETH</button>
          <button onClick={() => handleTransaction("withdraw")}>Withdraw 1 ETH</button>
        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}

// import { ethers } from "/ethers-5.6.esm.min.js"
import { abi} from "./abi.js"
import { abiWeth } from "./abiWeth.js"

const WETH = "0xdd13E55209Fd76AfE204dBda4007C227904f0a81"

const contractAddress = "0x4714075cafEC4E07fc3678CF19697fd91A1e9915"
const rpcUrl = "https://eth-sepolia.g.alchemy.com/v2/tyTWOxcpFmiTzLAQxu816zjdAasbpWIp"

const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accountsDisplay = document.getElementById("account")
    const web3 = new Web3(window.ethereum);
    const accounts = await  web3.eth.getAccounts();
    console.log(accounts[0])
    accountsDisplay.innerHTML = accounts[0]
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}


const depositButton = document.getElementById("depositButton")
depositButton.onclick = depositCollateral

async function loadWeb3() {
  if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
          console.error("User denied account access or error occurred:", error);
      }
  } else {
      window.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
}

async function loadWETH() {
  const weth = await new window.web3.eth.Contract(abiWeth, WETH);
  return weth;
}

async function approveWETH() {
  const contractAddress1 = document.getElementById("contractAddress").value;
  const amount = document.getElementById("approveAmount").value;
  console.log(`Approving... \n Contract Address = '${contractAddress1}' \n Amount = ${amount}`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const weth = await loadWETH();
      try {
          const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await weth.methods.approve(contractAddress1, amountInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  } else {
      document.getElementById("approveButton").innerHTML = "Please install MetaMask";
  }
}

const approveButton = document.getElementById("approveButton")
approveButton.onclick = approveWETH

async function loadContract() {
  await loadWeb3();
  return new window.web3.eth.Contract(abi, contractAddress);
}

async function depositCollateral() {
  const tokenAddress = document.getElementById("depositTokenAddress").value;
  const amount = document.getElementById("depositAmount").value;
  console.log(`Depositing... \n Token Address = '${tokenAddress}' \n Amount = ${amount}`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.depositCollateral(tokenAddress, amountInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  } else {
      document.getElementById("depositButton").innerHTML = "Please install MetaMask";
  }
}



// Function to listen for transaction mining (optional)
async function listenForTransactionMine(transactionResponse, web3Provider) {
  console.log(`Mining transaction ${transactionResponse.transactionHash}...`);
  return new Promise((resolve, reject) => {
      web3Provider.eth.getTransactionReceipt(transactionResponse.transactionHash, (error, receipt) => {
          if (error) {
              reject(error);
          } else if (receipt !== null) {
              console.log(`Transaction mined: ${receipt.transactionHash}`);
              resolve(receipt);
          }
      });
  });
}

// Load the web3 provider immediately when the script is loaded
loadWeb3();




async function loadProvider() {
  if (window.ethereum) {
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          console.log("Connected to network:", network);
          return provider;
      } catch (error) {
          console.error("User denied account access");
      }
  } else {
      alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
}

loadProvider()



const mintDscForOwnerButton = document.getElementById("MintForOwnerButton")
mintDscForOwnerButton.onclick = MintDscForOwner

async function MintDscForOwner() {
  const amount = document.getElementById("mintAmount").value;
  console.log(`Minting... \n Amount = ${amount}`);

  if (typeof window.ethereum !== "undefined") {
    await loadWeb3();
    const accounts = await window.web3.eth.getAccounts();
    const contract = await loadContract();
    try {
        const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
        const transactionResponse = await contract.methods.mintDscForOwner(amountInWei).send({ from: accounts[0] });
        console.log(transactionResponse);
        // Optional: Add function to listen for transaction mining
        listenForTransactionMine(transactionResponse, window.web3);
    }
    catch (error) {
        console.error(error);
    }
  } else {
    document.getElementById("MintForOwnerButton").innerHTML = "Please install MetaMask";
}
}

const depositAndMintDscButton = document.getElementById("depositAndMintDscButton")
depositAndMintDscButton.onclick = depositCollateralAndMintDsc

async function depositCollateralAndMintDsc() {
  const tokenAddress = document.getElementById("depositTokenAddressAndMint").value;
  const amountDeposit = document.getElementById("depositAmountForMint").value;
  const amountMint = document.getElementById("mintAmount").value;
  console.log(`Depositing and Minting DSC... \n Token Address = '${tokenAddress}' \n Amount Deposit = ${amountDeposit} \n Amount Mint = ${amountMint}`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountDepositInWei = window.web3.utils.toWei(amountDeposit, 'ether'); // Assuming 18 decimals for tokens
          const amountMintInWei = window.web3.utils.toWei(amountMint, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.depositCollateralAndMintDsc(tokenAddress, amountDepositInWei, amountMintInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  } else {
      document.getElementById("depositAndMintButton").innerHTML = "Please install MetaMask";
  }
}

async function redeemCollateral() {
  const tokenAddress = document.getElementById("").value;
  const amount = document.getElementById("").value;
  console.log(`Redeeming... \n Token Address`, tokenAddress, `\n Amount`, amount);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.redeemCollateral(tokenAddress, amountInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function redeemCollateralForDsc() {
  const tokenAddress = document.getElementById("").value;
  const amountCollateral = document.getElementById("").value;
  const amountBurn = document.getElementById("").value;
  console.log(`Redeeming and Burning... \n Token Address`, tokenAddress, `\n Amount`, amount);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountCollateralInWei = window.web3.utils.toWei(amountCollateral, 'ether'); // Assuming 18 decimals for tokens
          const amountBurnInWei = window.web3.utils.toWei(amountBurn, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.redeemCollateralForDsc(tokenAddress, amountCollateralInWei, amountBurnInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function mintDsc() {
  const amountMint = document.getElementById("").value;
  console.log(`Minting... \n Amount`, amountMint);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountMintInWei = window.web3.utils.toWei(amountMint, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.mintDsc(amountMintInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function burnDsc() {
  const amountBurn = document.getElementById("").value;
  console.log(`Burning... \n Amount`, amountBurn);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountBurnInWei = window.web3.utils.toWei(amountBurn, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.burnDsc(amountBurnInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}







async function savingWETHFor_1_Minute() {
  const amountSaving = document.getElementById("").value;
  console.log(`Saving... \n Amount`, amountSaving);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountSavingInWei = window.web3.utils.toWei(amountSaving, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.savingWETHFor_1_Minute(amountSavingInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function savingWETHFor_1_year() {
  const amountSaving = document.getElementById("").value;
  console.log(`Saving... \n Amount`, amountSaving);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountSavingInWei = window.web3.utils.toWei(amountSaving, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.savingWETHFor_1_year(amountSavingInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function redeemSavedWETHAfter_1_MinuteAndMintDscForInterest() {
  const amountSaving = document.getElementById("").value;
  console.log(`Redeeming... \n Amount`, amountSaving);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountSavingInWei = window.web3.utils.toWei(amountSaving, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.redeemSavedWETHAfter_1_MinuteAndMintDscForInterest(amountSavingInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function redeemSavedWETHAfter_1_YearAndMintDscForInterest() {
  const amountSaving = document.getElementById("").value;
  console.log(`Redeeming... \n Amount`, amountSaving);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountSavingInWei = window.web3.utils.toWei(amountSaving, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.redeemSavedWETHAfter_1_YearAndMintDscForInterest(amountSavingInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}








async function depositCollateralAndBorrowWETH_1_Minute() {
  const tokenAddress = document.getElementById("").value;
  const amountDeposit = document.getElementById("").value;
  const amountBorrow = document.getElementById("").value;
  console.log(`Depositing and Borrowing... \n Token Address`, tokenAddress, `\n Amount Deposit`, amountDeposit, `\n Amount Borrow`, amountBorrow);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountDepositInWei = window.web3.utils.toWei(amountDeposit, 'ether'); // Assuming 18 decimals for tokens
          const amountBorrowInWei = window.web3.utils.toWei(amountBorrow, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.depositCollateralAndBorrowWETH_1_Minute(tokenAddress, amountDepositInWei, amountBorrowInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

async function depositCollateralAndBorrowWETH_1_Year() {
  const tokenAddress = document.getElementById("").value;
  const amountDeposit = document.getElementById("").value;
  const amountBorrow = document.getElementById("").value;
  console.log(`Depositing and Borrowing... \n Token Address`, tokenAddress, `\n Amount Deposit`, amountDeposit, `\n Amount Borrow`, amountBorrow);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const accounts = await window.web3.eth.getAccounts();
      const contract = await loadContract();
      try {
          const amountDepositInWei = window.web3.utils.toWei(amountDeposit, 'ether'); // Assuming 18 decimals for tokens
          const amountBorrowInWei = window.web3.utils.toWei(amountBorrow, 'ether'); // Assuming 18 decimals for tokens
          const transactionResponse = await contract.methods.depositCollateralAndBorrowWETH_1_Year(tokenAddress, amountDepositInWei, amountBorrowInWei).send({ from: accounts[0] });
          console.log(transactionResponse);
          // Optional: Add function to listen for transaction mining
          listenForTransactionMine(transactionResponse, window.web3);
      } catch (error) {
          console.error(error);
      }
  }
}

// viet ham redeem sau khi fix lai contract


// 


// read functions //
// 1. getDscToken
async function getDscToken() {
  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const dscToken = await contract.methods.getDscToken().call();
          console.log(dscToken);
      } catch (error) {
          console.error(error);
      }
  }
}
// 2. 
async function getAccountInformation_1() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting account information... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountInformation = await contract.methods.getAccountInformation(addressUser).call();
          console.log(accountInformation);
      } catch (error) {
          console.error(error);
      }
  }
}
// 3
async function getAccountCollateralValue() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting account collateral value... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountCollateralValue = await contract.methods.getAccountCollateralValue(addressUser).call();
          console.log(accountCollateralValue);
      } catch (error) {
          console.error(error);
      }
  }
}
// 4
async function getCollateralBalanceOfUser() {
  const addressUser = document.getElementById("").value;
  const tokenAddress = document.getElementById("").value;
  console.log(`Getting collateral balance of user... \n Address User`, addressUser, `\n Token Address`, tokenAddress);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralBalanceOfUser = await contract.methods.getCollateralBalanceOfUser(addressUser, tokenAddress).call();
          console.log(collateralBalanceOfUser);
      } catch (error) {
          console.error(error);
      }
  }
}
// 5
async function getHealthFactor() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting health factor... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const healthFactor = await contract.methods.getHealthFactor(addressUser).call();
          console.log(healthFactor);
      } catch (error) {
          console.error(error);
      }
  }
}
// 6
async function getCollateralTokens() { // get all collateral tokens in the contract
  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralTokens = await contract.methods.getCollateralTokens().call();
          console.log(collateralTokens);
      } catch (error) {
          console.error(error);
      }
  }
}
// 7
async function getMinHealthFactor() {
  console.log(`Getting min health factor...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const minHealthFactor = await contract.methods.getMinHealthFactor().call();
          console.log(minHealthFactor);
      } catch (error) {
          console.error(error);
      }
  }
}
// 8
async function getInterestingRate() {
  console.log(`Getting interesting rate...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const interestingRate = await contract.methods.getInterestingRate().call();
          console.log(interestingRate);
      } catch (error) {
          console.error(error);
      }
  }
}
// 9
async function getBorrowingFeeRate() {
  console.log (`Getting borrowing fee rate...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const borrowingFeeRate = await contract.methods.getBorrowingFeeRate().call();
          console.log(borrowingFeeRate);
      } catch (error) {
          console.error(error);
      }
  }
}
// 10
async function getBalanceOfWEtherInContract() {
  console.log(`Getting balance of wether in contract...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const balanceOfWEtherInContract = await contract.methods.getBalanceOfWEtherInContract().call();
          console.log(balanceOfWEtherInContract);
      } catch (error) {
          console.error(error);
      }
  }
}
// 11
async function getEndTimeSaved(){
  const addressUser = document.getElementById("").value;
  console.log(`Getting end time saved... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const endTimeSaved = await contract.methods.getEndTimeSaved(addressUser).call();
          console.log(endTimeSaved);
      } catch (error) {
          console.error(error);
      }
  }
}
// 12
async function getEndTimeBorrowed() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting end time borrowed... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const endTimeBorrowed = await contract.methods.getEndTimeBorrowed(addressUser).call();
          console.log(endTimeBorrowed);
      } catch (error) {
          console.error(error);
      }
  }
}
// 13
async function getWEtherSaved() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting wether saved... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const wEtherSaved = await contract.methods.getWEtherSaved(addressUser).call();
          console.log(wEtherSaved);
      } catch (error) {
          console.error(error);
      }
  }
}

// 14
async function getWEtherBorrowed() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting wether borrowed... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const wEtherBorrowed = await contract.methods.getWEtherBorrowed(addressUser).call();
          console.log(wEtherBorrowed);
      } catch (error) {
          console.error(error);
      }
  }
}
// 15
async function getUsdValue() {
  const tokenAddress = document.getElementById("").value;
  const amount = document.getElementById("").value;
  console.log(`Getting usd value... \n Token Address`, tokenAddress, `\n Amount`, amount);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
          const usdValue = await contract.methods.getUsdValue(tokenAddress, amountInWei).call();
          console.log(usdValue);
      } catch (error) {
          console.error(error);
      }
  }
}
//16
async function getTokenAmountFromUsd() {
  const tokenAddress = document.getElementById("").value;
  const amountUsd = document.getElementById("").value;
  console.log(`Getting token amount from usd... \n Token Address`, tokenAddress, `\n Amount Usd`, amountUsd);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const amountUsdInWei = window.web3.utils.toWei(amountUsd, 'ether'); // Assuming 18 decimals for tokens
          const tokenAmountFromUsd = await contract.methods.getTokenAmountFromUsd(tokenAddress, amountUsdInWei).call();
          console.log(tokenAmountFromUsd);
      } catch (error) {
          console.error(error);
      }
  }
}

// 17
async function getHealthFactorForBorrowWEther() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting health factor for borrow wether... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const healthFactorForBorrowWEther = await contract.methods.getHealthFactorForBorrowWEther(addressUser).call();
          console.log(healthFactorForBorrowWEther);
      } catch (error) {
          console.error(error);
      }
  }
}
//18
async function getDSCMintedForInterest() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting DSC minted for interest... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const dscMintedForInterest = await contract.methods.getDSCMintedForInterest(addressUser).call();
          console.log(dscMintedForInterest);
      } catch (error) {
          console.error(error);
      }
  }
}
// 19
async function getCollateralDepositedForBorrowEther() {
  const addressUser = document.getElementById("").value;
  const tokenAddress = document.getElementById("").value;
  console.log(`Getting collateral deposited for borrow ether... \n Address User`, addressUser, `\n Token Address`, tokenAddress);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralDepositedForBorrowEther = await contract.methods.getCollateralDepositedForBorrowEther(addressUser, tokenAddress).call();
          console.log(collateralDepositedForBorrowEther);
      } catch (error) {
          console.error(error);
      }
  }
}
// 20
async function getAccounCollateralValueForBorrowEther() {
  const addressUser = document.getElementById("").value;
  console.log(`Getting account collateral value for borrow ether... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountCollateralValueForBorrowEther = await contract.methods.getAccounCollateralValueForBorrowEther(addressUser).call();
          console.log(accountCollateralValueForBorrowEther);
      } catch (error) {
          console.error(error);
      }
  }
}

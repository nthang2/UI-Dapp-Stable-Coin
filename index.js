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
// Approve WETH
const approveButton = document.getElementById("approveButton")
approveButton.onclick = approveWETH

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

async function loadContract() {
  await loadWeb3();
  return new window.web3.eth.Contract(abi, contractAddress);
}

// Load the web3 provider immediately when the script is loaded


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
  

// Wrrite function of contract

// 1. depositCollateralAndMintDsc
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

// 1.1 depositCollateral


const depositButton = document.getElementById("depositButton")
depositButton.onclick = depositCollateral

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

// 2. redeemCollateral
const redeemButton = document.getElementById("redeemButton")
redeemButton.onclick = redeemCollateral

async function redeemCollateral() {
  const tokenAddress = document.getElementById("tokenCollateral").value;
  const amount = document.getElementById("redeemAmount").value;
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

// 2.1 redeemCollateralForDsc
const redeemCollateralForDscButton = document.getElementById("redeemForDscButton")
redeemCollateralForDscButton.onclick = redeemCollateralForDsc

async function redeemCollateralForDsc() {
  const tokenAddress = document.getElementById("tokenCollateralForDsc").value;
  const amountCollateral = document.getElementById("redeemAmountForDsc").value;
  const amountBurn = document.getElementById("amountDscBurn").value;
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

//3. mintDsc
const mintDscButton = document.getElementById("mintDscButton")
mintDscButton.onclick = mintDsc

async function mintDsc() {
  const amountMint = document.getElementById("mintAmount").value;
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
//3.1 burnDsc
const burnDscButton = document.getElementById("burnDscButton")
burnDscButton.onclick = burnDsc


async function burnDsc() {
  const amountBurn = document.getElementById("burnAmount").value;
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

//4. depositCollateralAndBorrowWETH 1 minute
const depositAndBorrowWETHButton_1Mi = document.getElementById("depositAndBorrowButton1MinuteButton")
depositAndBorrowWETHButton_1Mi.onclick = depositCollateralAndBorrowWETH_1_Minute

async function depositCollateralAndBorrowWETH_1_Minute() {
    const tokenAddress = document.getElementById("tokenAddressForBorrow_1_Mi").value;
    const amountDeposit = document.getElementById("amountCollateralForBorrow_1_Mi").value;
    const amountBorrow = document.getElementById("amountWEtherBorrow_1_Mi").value;
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
//5. depositCollateralAndBorrowWETH 1 year
const depositAndBorrowWETHButton_1Y = document.getElementById("depositAndBorrowButton1YearButton")
depositAndBorrowWETHButton_1Y.onclick = depositCollateralAndBorrowWETH_1_Year

  async function depositCollateralAndBorrowWETH_1_Year() {
    const tokenAddress = document.getElementById("tokenAddressForBorrow_1_Y").value;
    const amountDeposit = document.getElementById("amountCollateralForBorrow_1_Y").value;
    const amountBorrow = document.getElementById("amountWEtherBorrow_1_Y").value;
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

//6. Redeem collateral and return WETH before 1 Minute
const redeemCollateralAndReturnWEtherBefore_1_MinuteButton = document.getElementById("redeemBorrowed_Bf_1MiBtn")
redeemCollateralAndReturnWEtherBefore_1_MinuteButton.onclick = redeemCollateralAndReturnWEtherBefore_1_Minute

async function redeemCollateralAndReturnWEtherBefore_1_Minute () {
    const tokenAddress = document.getElementById("tokenCollateralBorrowed_Bf_1Mi").value;
    const amountCollateral = document.getElementById("amountCollateralBorrowed_Bf_1Mi").value;
    const amountWEther = document.getElementById("amountWEther_Bf_1Mi").value;
    console.log(`Redeeming and Returning... \n Token Address`, tokenAddress, `\n Amount Collateral`, amountCollateral, `\n Amount WEther`, amountWEther);

    if (typeof window.ethereum !== "undefined") {
        await loadWeb3();
        const accounts = await window.web3.eth.getAccounts();
        const contract = await loadContract();
        try {
            const amountCollateralInWei = window.web3.utils.toWei(amountCollateral, 'ether'); // Assuming 18 decimals for tokens
            const amountWEtherInWei = window.web3.utils.toWei(amountWEther, 'ether'); // Assuming 18 decimals for tokens
            const transactionResponse = await contract.methods.redeemCollateralAndReturnWEtherBefore_1_Minute(tokenAddress, amountCollateralInWei, amountWEtherInWei).send({ from: accounts[0] });
            console.log(transactionResponse);
            // Optional: Add function to listen for transaction mining
            listenForTransactionMine(transactionResponse, window.web3);
        } catch (error) {
            console.error(error);
        }
    }
}

//7. Redeem collateral and return WETH before 1 Year
const redeemCollateralAndReturnWEtherBefore_1_YearButton = document.getElementById("redeemBorrowed_Bf_1YBtn")
redeemCollateralAndReturnWEtherBefore_1_YearButton.onclick = redeemCollateralAndReturnWEtherBefore_1_Year

async function redeemCollateralAndReturnWEtherBefore_1_Year () {
    const tokenAddress = document.getElementById("tokenCollateralBorrowed_Bf_1Y").value;
    const amountCollateral = document.getElementById("amountCollateralBorrowed_Bf_1Y").value;
    const amountWEther = document.getElementById("amountWEther_Bf_1Y").value;
    console.log(`Redeeming and Returning... \n Token Address`, tokenAddress, `\n Amount Collateral`, amountCollateral, `\n Amount WEther`, amountWEther);

    if (typeof window.ethereum !== "undefined") {
        await loadWeb3();
        const accounts = await window.web3.eth.getAccounts();
        const contract = await loadContract();
        try {
            const amountCollateralInWei = window.web3.utils.toWei(amountCollateral, 'ether'); // Assuming 18 decimals for tokens
            const amountWEtherInWei = window.web3.utils.toWei(amountWEther, 'ether'); // Assuming 18 decimals for tokens
            const transactionResponse = await contract.methods.redeemCollateralAndReturnWEtherBefore_1_Year(tokenAddress, amountCollateralInWei, amountWEtherInWei).send({ from: accounts[0] });
            console.log(transactionResponse);
            // Optional: Add function to listen for transaction mining
            listenForTransactionMine(transactionResponse, window.web3);
        } catch (error) {
            console.error(error);
        }
    }
}

//8. Redeem all collateral and return WETH after 1 Minute
const redeemAllCollateralAndReturnWEtherAfter_1_MinuteButton = document.getElementById("redeemAndReturnAllButton_After_1MiBtn")
redeemAllCollateralAndReturnWEtherAfter_1_MinuteButton.onclick = redeemAllCollateralAndReturnWEtherAfter_1_Minute

async function redeemAllCollateralAndReturnWEtherAfter_1_Minute () {
    const tokenAddress = document.getElementById("tokenCollateral_After_1Mi").value;
    console.log(`Redeeming and Returning... \n Token Address`, tokenAddress);

    if (typeof window.ethereum !== "undefined") {
        await loadWeb3();
        const accounts = await window.web3.eth.getAccounts();
        const contract = await loadContract();
        try {
            const transactionResponse = await contract.methods.redeemAllCollateralAndReturnWEtherAfter_1_Minute(tokenAddress).send({ from: accounts[0] });
            console.log(transactionResponse);
            // Optional: Add function to listen for transaction mining
            listenForTransactionMine(transactionResponse, window.web3);
        } catch (error) {
            console.error(error);
        }
    }
}

//9. Redeem all collateral and return WETH after 1 Year
const redeemAllCollateralAndReturnWEtherAfter_1_YearButton = document.getElementById("redeemAndReturnAllButton_After_1YBtn")
redeemAllCollateralAndReturnWEtherAfter_1_YearButton.onclick = redeemAllCollateralAndReturnWEtherAfter_1_Year

async function redeemAllCollateralAndReturnWEtherAfter_1_Year () {
    const tokenAddress = document.getElementById("tokenCollateral_After_1Y").value;
    console.log(`Redeeming and Returning... \n Token Address`, tokenAddress);

    if (typeof window.ethereum !== "undefined") {
        await loadWeb3();
        const accounts = await window.web3.eth.getAccounts();
        const contract = await loadContract();
        try {
            const transactionResponse = await contract.methods.redeemAllCollateralAndReturnWEtherAfter_1_Year(tokenAddress).send({ from: accounts[0] });
            console.log(transactionResponse);
            // Optional: Add function to listen for transaction mining
            listenForTransactionMine(transactionResponse, window.web3);
        } catch (error) {
            console.error(error);
        }
    }
}

//10. Saving WETH for 1 Minute
const savingWETHFor_1_MinuteButton = document.getElementById("savingButton1MinuteBtn")
savingWETHFor_1_MinuteButton.onclick = savingWETHFor_1_Minute

async function savingWETHFor_1_Minute() {
  const amountSaving = document.getElementById("amountWEther_Saving_1Mi").value;
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
//11. Saving WETH for 1 year
const savingWETHFor_1_yearButton = document.getElementById("savingButton1YearBtn")
savingWETHFor_1_yearButton.onclick = savingWETHFor_1_year

async function savingWETHFor_1_year() {
  const amountSaving = document.getElementById("amountWEther_Saving_1Y").value;
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

//12. Redeem saved WETH after 1 Minute and mint DSC for interest
const redeemSavedWETHAfter_1_MinuteAndMintDscForInterestButton = document.getElementById("redeemSaved_1MiBtn")
redeemSavedWETHAfter_1_MinuteAndMintDscForInterestButton.onclick = redeemSavedWETHAfter_1_MinuteAndMintDscForInterest

async function redeemSavedWETHAfter_1_MinuteAndMintDscForInterest() {
  const amountSaving = document.getElementById("amountRedeem_Saved_1Mi").value;
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

//13. Redeem saved WETH after 1 Year and mint DSC for interest
const redeemSavedWETHAfter_1_YearAndMintDscForInterestButton = document.getElementById("redeemSaved_1YBtn")
redeemSavedWETHAfter_1_YearAndMintDscForInterestButton.onclick = redeemSavedWETHAfter_1_YearAndMintDscForInterest

async function redeemSavedWETHAfter_1_YearAndMintDscForInterest() {
  const amountSaving = document.getElementById("amountRedeem_Saved_1Mi").value;
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

//14. Mint DSC for owner

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


////////////////////
// Read functions //
////////////////////

// 1. getDscToken
const getDscTokenButton = document.getElementById("getDscBtn")
getDscTokenButton.onclick = getDscToken
async function getDscToken() {
  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const dscToken = await contract.methods.getDsc().call();
          console.log(dscToken);
          document.getElementById("dscToken").innerHTML = dscToken;
      } catch (error) {
          console.error(error);
      }
  }
}
// 2. 
const getAccountInformationButton = document.getElementById("getAccInf_DepositAndMintDscBtn")
getAccountInformationButton.onclick = getAccountInformation
async function getAccountInformation() {
  const addressUser = document.getElementById("getAccInf_DepositAndMint").value;
  console.log(`Getting account information... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountInformation = await contract.methods.getAccountInformation(addressUser).call();
          console.log(accountInformation);
          document.getElementById("accountInformation_DscMinted").innerHTML = 'total Dsc Minted: ' + (accountInformation[0]/(10**18)).toFixed(3);
          document.getElementById("accountInformation_Collateral").innerHTML = 'Collateral Value (In USD): ' + (accountInformation[1]/1e18).toFixed(3);
      } catch (error) {
          console.error(error);
      }
  }
}
// 3
const getAccountCollateralValueButton = document.getElementById("getAccountCollateralValueBtn")
getAccountCollateralValueButton.onclick = getAccountCollateralValue

async function getAccountCollateralValue() {
  const addressUser = document.getElementById("getAccountCollateralValueAddress").value;
  console.log(`Getting account collateral value... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountCollateralValue = await contract.methods.getAccountCollateralValue(addressUser).call();
          console.log(accountCollateralValue);
          document.getElementById("accountCollateralValue").innerHTML = 'Collateral Value (In USD): ' + (accountCollateralValue/1e18).toFixed(3);
      } catch (error) {
          console.error(error);
      }
  }
}
// 4
const getCollateralBalanceOfUserButton = document.getElementById("getCollateralBalanceBtn")
getCollateralBalanceOfUserButton.onclick = getCollateralBalanceOfUser

async function getCollateralBalanceOfUser() {
  const addressUser = document.getElementById("getCollateralBalanceAddressUser").value;
  const tokenAddress = document.getElementById("getCollateralBalanceToken").value;
  console.log(`Getting collateral balance of user... \n Address User`, addressUser, `\n Token Address`, tokenAddress);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralBalanceOfUser = await contract.methods.getCollateralBalanceOfUser(addressUser, tokenAddress).call();
          console.log(collateralBalanceOfUser);
        document.getElementById("collateralBalance").innerHTML = 'Collateral Balance: ' + (collateralBalanceOfUser/1e18).toFixed(3) ;
      } catch (error) {
          console.error(error);
      }
  }
}
// 5
const getHealthFactorButton = document.getElementById("getHealthFactorBtn")
getHealthFactorButton.onclick = getHealthFactor

async function getHealthFactor() {
  const addressUser = document.getElementById("getHealthFactorAddress").value;
  console.log(`Getting health factor... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const healthFactor = await contract.methods.getHealthFactor(addressUser).call();
          console.log(healthFactor);
            document.getElementById("healthFactor").innerHTML = 'Health Factor: ' + (healthFactor/1e18).toFixed(3);  
      } catch (error) {
          console.error(error);
      }
  }
}
// 6
const getCollateralTokensButton = document.getElementById("getCollateralTokenBtn")
getCollateralTokensButton.onclick = getCollateralTokens

async function getCollateralTokens() { // get all collateral tokens in the contract
  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralTokens = await contract.methods.getCollateralTokens().call();
          console.log(collateralTokens);
            document.getElementById("collateralToken_1").innerHTML = 'Collateral Tokens: ' + collateralTokens[0];
            document.getElementById("collateralToken_2").innerHTML = collateralTokens[1];
      } catch (error) {
          console.error(error);
      }
  }
}
// 7
const getMinHealthFactorButton = document.getElementById("getMinHealthFactorBtn")
getMinHealthFactorButton.onclick = getMinHealthFactor

async function getMinHealthFactor() {
  console.log(`Getting min health factor...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const minHealthFactor = await contract.methods.getMinHealthFactor().call();
          console.log(minHealthFactor);
            document.getElementById("minHealthFactor").innerHTML = 'Min Health Factor: ' + (minHealthFactor/1e18).toFixed();
      } catch (error) {
          console.error(error);
      }
  }
}
// 8
const getInterestingRateBtn = document.getElementById("getInterestRateBtn")
getInterestingRateBtn.onclick = getInterestingRate
async function getInterestingRate() {
  console.log(`Getting interesting rate...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const interestingRate = await contract.methods.getInterestingRate().call();
          console.log(interestingRate);
            document.getElementById("interestRate").innerHTML = 'Interesting Rate: ' + (interestingRate/1e3) + '%';
      } catch (error) {
          console.error(error);
      }
  }
}
// 9
const getBorrowingFeeRateButton = document.getElementById("getBorrowingFeeRateBtn")
getBorrowingFeeRateButton.onclick = getBorrowingFeeRate
async function getBorrowingFeeRate() {
  console.log (`Getting borrowing fee rate...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const borrowingFeeRate = await contract.methods.getBorrowingFeeRate().call();
          console.log(borrowingFeeRate);
            document.getElementById("borrowingFeeRate").innerHTML = 'Borrowing Fee Rate: ' + (borrowingFeeRate/1e3) + '%';
      } catch (error) {
          console.error(error);
      }
  }
}
// 10
const getBalanceOfDscInContractButton = document.getElementById("getBalanceOfWETHBtn")
getBalanceOfDscInContractButton.onclick = getBalanceOfWEtherInContract

async function getBalanceOfWEtherInContract() {
  console.log(`Getting balance of wether in contract...`);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const balanceOfWEtherInContract = await contract.methods.getBalanceOfWEtherInContract().call();
          console.log(balanceOfWEtherInContract);
            document.getElementById("balanceOfWETH").innerHTML = 'Balance of Wether in Contract: ' + (balanceOfWEtherInContract/1e18).toFixed(8) + ' WETH';
      } catch (error) {
          console.error(error);
      }
  }
}

// 10.5
const getBlockTimeNowButton = document.getElementById("getTimeNowBtn")
getBlockTimeNowButton.onclick = getBlockTimeNow

async function getBlockTimeNow(){
    console.log(`Getting block time now...`);

    if (typeof window.ethereum !== "undefined") {
        await loadWeb3();
        const contract = await loadContract();
        try {
            const blockTimeNow = await contract.methods.getBlockTimeNow().call();
            console.log(blockTimeNow);
            document.getElementById("blockTimeNow").innerHTML = 'Block Time Now: ' + blockTimeNow + ' seconds';
        } catch (error) {
            console.error(error);
        }
    }
}

// 11
const getEndTimeSavedButton = document.getElementById("getEndTimeSavingBtn")
getEndTimeSavedButton.onclick = getEndTimeSaved

async function getEndTimeSaved(){
  const addressUser = document.getElementById("getEndTimeSavingAddress").value;
  console.log(`Getting end time saved... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const endTimeSaved = await contract.methods.getEndTimeSaved(addressUser).call();
          console.log(endTimeSaved);
          document.getElementById("endTimeSaving").innerHTML = 'End Time Saved: ' + endTimeSaved;
      } catch (error) {
          console.error(error);
      }
  }
}
// 12
const getEndTimeBorrowedButton = document.getElementById("getEndTimeBorrowingBtn")
getEndTimeBorrowedButton.onclick = getEndTimeBorrowed

async function getEndTimeBorrowed() {
  const addressUser = document.getElementById("getEndTimeBorrowingAddress").value;
  console.log(`Getting end time borrowed... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const endTimeBorrowed = await contract.methods.getEndTimeBorrowed(addressUser).call();
          console.log(endTimeBorrowed);
          document.getElementById("endTimeBorrowing").innerHTML = 'End Time Borrowed: ' + endTimeBorrowed;
          if (endTimeBorrowed == 0) {
              document.getElementById("endTimeBorrowing").innerHTML = 'Not Borrowed Yet';
          }
      } catch (error) {
          console.error(error);
          
      }
  }
}
// 13
const getWEtherSavedButton = document.getElementById("getWETHSavedBtn")
getWEtherSavedButton.onclick = getWEtherSaved

async function getWEtherSaved() {
  const addressUser = document.getElementById("getWETHSavedAddress").value;
  console.log(`Getting wether saved... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const wEtherSaved = await contract.methods.getWEtherSaved(addressUser).call();
          console.log(wEtherSaved);
            document.getElementById("wethSaved").innerHTML = 'Wether Saved: ' + (wEtherSaved/1e18).toFixed(8) + ' WETH';
      } catch (error) {
          console.error(error);
      }
  }
}

// 14
const getWEtherBorrowedButton = document.getElementById("getWETHBorrowedBtn")
getWEtherBorrowedButton.onclick = getWEtherBorrowed
async function getWEtherBorrowed() {
  const addressUser = document.getElementById("getWETHBorrowedAddress").value;
  console.log(`Getting wether borrowed... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const wEtherBorrowed = await contract.methods.getWEtherBorrowed(addressUser).call();
          console.log(wEtherBorrowed);
            document.getElementById("wethBorrowed").innerHTML = 'Wether Borrowed: ' + (wEtherBorrowed/1e18).toFixed(8) + ' WETH';
      } catch (error) {
          console.error(error);
      }
  }
}
// 15
const getUsdValueButton = document.getElementById("getUSDValueOfTokenBtn")
getUsdValueButton.onclick = getUsdValue
async function getUsdValue() {
  const tokenAddress = document.getElementById("getUSDValueOfTokenAddress").value;
  const amount = document.getElementById("getUSDValueOfTokenAmount").value;
  console.log(`Getting usd value... \n Token Address`, tokenAddress, `\n Amount`, amount);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const amountInWei = window.web3.utils.toWei(amount, 'ether'); // Assuming 18 decimals for tokens
          const usdValue = await contract.methods.getUsdValue(tokenAddress, amountInWei).call();
          console.log(usdValue);
            document.getElementById("usdValueOfToken").innerHTML = 'USD Value: ' + (usdValue/1e18).toFixed(3) + ' USD';
      } catch (error) {
          console.error(error);
      }
  }
}
//16
const getTokenAmountFromUsdButton = document.getElementById("getTokenAmountFromUSDBtn")
getTokenAmountFromUsdButton.onclick = getTokenAmountFromUsd

async function getTokenAmountFromUsd() {
  const tokenAddress = document.getElementById("getTokenAmountFromUSDToken").value;
  const amountUsd = document.getElementById("getTokenAmountFromUSDValue").value;
  console.log(`Getting token amount from usd... \n Token Address`, tokenAddress, `\n Amount Usd`, amountUsd);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const amountUsdInWei = window.web3.utils.toWei(amountUsd, 'ether'); // Assuming 18 decimals for tokens
          const tokenAmountFromUsd = await contract.methods.getTokenAmountFromUsd(tokenAddress, amountUsdInWei).call();
          console.log(tokenAmountFromUsd);
          document.getElementById("tokenAmountFromUSD").innerHTML = 'Token Amount: ' + (tokenAmountFromUsd/1e18).toFixed(8);
      } catch (error) {
          console.error(error);
      }
  }
}

// 17 ////////// BUG IN CONTRACT
const getHealthFactorForBorrowWEtherButton = document.getElementById("getHealthFactorForBorrowWETHBtn")
getHealthFactorForBorrowWEtherButton.onclick = getHealthFactorForBorrowWEther
async function getHealthFactorForBorrowWEther() {
  const addressUser = document.getElementById("getHealthFactorForBorrowWETHAddress").value;
  console.log(`Getting health factor for borrow wether... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const healthFactorForBorrowWEther = await contract.methods.getHealthFactorForBorrowWEther(addressUser).call();
          console.log(healthFactorForBorrowWEther);
          document.getElementById("healthFactorForBorrowWETH").innerHTML = 'Health Factor: ' + (healthFactorForBorrowWEther/1e18).toFixed(3);
      } catch (error) {
          console.error(error);
      }
  }
}
//18
const getDSCMintedForInterestButton = document.getElementById("getDSCMintedForInterestBtn")
getDSCMintedForInterestButton.onclick = getDSCMintedForInterest

async function getDSCMintedForInterest() {
  const addressUser = document.getElementById("getDSCMintedForInterestAddress").value;
  console.log(`Getting DSC minted for interest... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const dscMintedForInterest = await contract.methods.getDSCMintedForInterest(addressUser).call();
          console.log(dscMintedForInterest);
            document.getElementById("dscMintedForInterest").innerHTML = 'DSC Minted For Interest: ' + (dscMintedForInterest/1e18).toFixed(8);
      } catch (error) {
          console.error(error);
      }
  }
}
// 19
const getCollateralDepositedForBorrowDscButton = document.getElementById("getCollateralDepositedForBorrowEtherBtn")
getCollateralDepositedForBorrowDscButton.onclick = getCollateralDepositedForBorrowEther
async function getCollateralDepositedForBorrowEther() {
  const addressUser = document.getElementById("getCollateralDepositedForBorrowEtherAddress").value;
  const tokenAddress = document.getElementById("getCollateralDepositedForBorrowEtherToken").value;
  console.log(`Getting collateral deposited for borrow ether... \n Address User`, addressUser, `\n Token Address`, tokenAddress);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const collateralDepositedForBorrowEther = await contract.methods.getCollateralDepositedForBorrowEther(addressUser, tokenAddress).call();
          console.log(collateralDepositedForBorrowEther);
          document.getElementById("collateralDepositedForBorrowEther").innerHTML = 'Collateral Deposited For Borrow Ether: ' + (collateralDepositedForBorrowEther/1e18).toFixed(8);
      } catch (error) {
          console.error(error);
      }
  }
}
// 20
const getAccounCollateralValueForBorrowEtherButton = document.getElementById("getAccountCollateralValueForBorrowWETHBtn")
getAccounCollateralValueForBorrowEtherButton.onclick = getAccounCollateralValueForBorrowEther

async function getAccounCollateralValueForBorrowEther() {
  const addressUser = document.getElementById("getAccountCollateralValueForBorrowWETHAddress").value;
  console.log(`Getting account collateral value for borrow ether... \n Address User`, addressUser);

  if (typeof window.ethereum !== "undefined") {
      await loadWeb3();
      const contract = await loadContract();
      try {
          const accountCollateralValueForBorrowEther = await contract.methods.getAccountCollateralValueForBorrowEther(addressUser).call();
          console.log(accountCollateralValueForBorrowEther);
            document.getElementById("accountCollateralValueForBorrowWETH").innerHTML = 'Account Collateral Value For Borrow Ether: ' + (accountCollateralValueForBorrowEther/1e18).toFixed(8);
      } catch (error) {
          console.error(error);
      }
  }
}

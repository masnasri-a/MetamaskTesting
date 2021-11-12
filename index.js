"use strict";

// import Web3 from "web3";
// import Web3Modal from "web3modal";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

window.userWalletAddress = null
const loginBtn = document.getElementById('connect')
const w3mBtn = document.getElementById('connectW3m')
const userWallet = document.getElementById('userWallet')
const images = document.getElementById('imagesMetamask')
const main = document.getElementById('main')
const chainIds = document.getElementById('chainId')
const netVersion = document.getElementById('netVersion')
const sendTrans = document.getElementById('sendBtn')
const balanceCheck = document.getElementById('balanceBtn')
const personalSigns = document.getElementById('personalSignBtn')
let isLogin = false
let mainAccount = null

function init() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "041cd0772a109ba00d9e19a330513878",
            }
        }
    };

    const web3modal = await new Web3Modal({
        providerOptions,
        disableInjectedProvider: false,
        cacheProvider: false,
    });
    console.log("Web3Modal instance is", web3modal);

}

async function onConnect() {

}

function toggleBtn() {
    if (!window.ethereum) {
        loginBtn.innerHTML = 'Metamask Not Installed'
        loginBtn.classList.remove('bg-purple-500', 'text-white')
        loginBtn.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
        return false
    }
    loginBtn.addEventListener('click', loginWithMetaMask)
    w3mBtn.addEventListener('click', w3mFunction)
    ethereum.on('accountsChanged', changedAccounts)
    ethereum.on('chainChanged', changedAccounts)
    sendTrans.addEventListener('click', sendTransaction)
    balanceCheck.addEventListener('click', balanceChecks)
    personalSigns.addEventListener('click', personalSignFunc)
}




async function personalSignFunc() {
    let messages = document.getElementById('personalAlert').innerHTML
    params = [
        messages.toString(16),
        document.getElementById('personal-address').value
    ]
    let sign = await ethereum.request({
        'params': params,
        'method': 'personal_sign'
    }).catch((error) => console.log(error))

    console.log("sign " + sign)
    let verify = await ethereum.request({
        'method': 'personal_ecRecover',
        params: [
            messages.toString(16),
            sign
        ]
    }).catch((error) => console.log(error))
    console.log("verify " + verify)
    let allert = ""
    if (verify === document.getElementById('personal-address').value) {
        allert = "Berhasil Sign dan Verify"
        document.getElementById('personalAlert').innerHTML = allert
    } else {
        allert = "Tidak Berhasil Sign dan Verify"
        document.getElementById('personalAlert').innerHTML = allert

    }
}

async function balanceChecks() {
    let address = document.getElementById('balance-address').value
    let val = "test"
    let balances = await ethereum.request({
        'method': 'eth_getBalance',
        'params': [address, "latest"]
    }).then((txHash) => val = txHash).catch((error) => console.log(error))
    console.log(val)
    document.getElementById('balanceAlert').innerHTML = parseInt(val, 16) / 1000000000000000000 + " ETH";

}

function sendTransaction() {
    let addressTrans = document.getElementById('trans-address').value
    let totalEthSend = document.getElementById('trans-eth').value
    let params = [{
        from: mainAccount,
        to: addressTrans,
        value: "0x" + (parseInt(totalEthSend) * 1000000000000000000).toString(16),
    }, ]

    ethereum.request({
            'method': 'eth_sendTransaction',
            'params': params,
        }).then((txHash) => console.log(txHash))
        .catch((error) => console.log(error))

    console.log(params)
}


function changedAccounts() {
    loginWithMetaMask()

}


async function loginWithMetaMask() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .catch((e) => {
            console.error(e)
            return
        })
    mainAccount = accounts[0]
    document.getElementById('personal-address').value = mainAccount
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    const netVersions = await ethereum.request({ method: 'net_version' });
    chainIds.innerHTML = "Chain Id : " + chainId
    netVersion.innerHTML = "Network : " + netVersions
    document.getElementById('balance-address').value = mainAccount
    if (!accounts) {
        return
    }

    images.style.display = "none";
    main.style.display = "unset";
    window.userWalletAddress = accounts[0]
    userWallet.innerHTML = "Address : " +
        window.userWalletAddress
    console.log('accounts = ' + accounts[0])
    loginBtn.innerHTML = 'Sign Out  Metamask'
    loginBtn.removeEventListener('click', loginWithMetaMask)
    setTimeout(() => {
        loginBtn.addEventListener('click', signOutOfMetaMask)
    }, 200)
    isLogin = true
    console.log("Login Status = " + isLogin)

}


function signOutOfMetaMask() {
    window.userWalletAddress = null
    userWallet.innerText = ''
    loginBtn.innerText = 'Sign in with MetaMask'

    loginBtn.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
        loginBtn.addEventListener('click', loginWithMetaMask)
    }, 200)
}


window.addEventListener('DOMContentLoaded', () => {
    toggleBtn()

});
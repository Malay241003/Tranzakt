import React from 'react';

export default function() {
    return <div className="w-screen p-4">

      <div className="bg-white rounded-lg shadow-md p-6 max-w-10xl mx-auto my-6">
        <div className="text-center flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto">
            Fast, Secure, and Simple Digital Payments
          </h1>
          <p className="text-xl text-gray-600">
            Send money, make bank transfers, and manage your finances.
          </p>
          <p className="text-xl text-gray-600 mb-0 mx-auto">
            all in one place.
          </p>
        </div>
      </div>

      <div>
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Why Choose Us
          </h2>
        <div className="grid md:grid-cols-3 gap-8">
      
        <div className="text-center p-6">
          <div className="flex items-center justify-center mx-auto mb-4">
            {<WalletIcon/>}
          </div>
          <h3 className="text-xl font-semibold mb-2">Money Wallet</h3>
          <p className="text-gray-600">Transfer money seamlessly from your bank account to your wallet and make payments effortlessly.</p>
        </div>
      
      
        <div className="text-center p-6">
          <div className="flex items-center justify-center mx-auto mb-4">
            {<P2pTransfersIcon/>} {<TransferIcon/>} {<P2pTransfersIcon/>}
          </div>
          <h3 className="text-xl font-semibold mb-2">Peer-to-Peer Transfers</h3>
          <p className="text-gray-600">Send money directly to other users quickly and securely using our P2P transfer feature.</p>
        </div>
      
        <div className="text-center p-6">
          <div className="flex items-center justify-center mx-auto mb-4">
            {<TransactionsIcon/>}
          </div>
          <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
          <p className="text-gray-600">View all your transactions, including wallet transfers and P2P payments, in one convenient place.</p>
        </div>
        </div>
      </div>
    </div>

    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">TranZakt</h3>
            <p className="text-sm">The most trusted payment platform for all your needs</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>Payments</li>
              <li>Transfers</li>
              <li>Banking</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
}


function WalletIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 text-purple-800">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>  
}
function P2pTransfersIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 text-purple-800">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg> 
}

function TransactionsIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 text-purple-800">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>  
}

function TransferIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 text-purple-800">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
}
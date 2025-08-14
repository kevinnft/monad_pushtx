import fs from 'fs';
import 'dotenv/config';
import { ethers } from 'ethers';
import chalk from 'chalk';

const RPC_URL = "https://rpc.ankr.com/monad_testnet";
const provider = new ethers.JsonRpcProvider(RPC_URL);
const MIN_BALANCE = ethers.parseUnits("1", 18); // stop jika saldo < 1 MON
const AMOUNT = ethers.parseUnits("0.00000001", 18); // jumlah kirim per tx
const GAS_PRICE = ethers.parseUnits("50", "gwei"); // gas price fix
const MAX_PARALLEL_TX = 3; // jumlah tx per batch

// ambil daftar private key wallet
const wallets = fs.readFileSync('wallets.txt', 'utf-8')
  .trim().split('\n')
  .map(pk => new ethers.Wallet(pk.trim(), provider));

// ambil daftar address tujuan
const targets = fs.readFileSync('address.txt', 'utf-8')
  .trim().split('\n')
  .map(addr => addr.trim());

async function sendWithConfirm(wallet) {
  let balance = await provider.getBalance(wallet.address);
  if (balance < MIN_BALANCE) {
    console.log(chalk.red(`⛔ ${wallet.address} saldo < 1 MON (${ethers.formatUnits(balance, 18)} MON)`));
    return;
  }

  let nonce = await provider.getTransactionCount(wallet.address, 'latest');
  console.log(chalk.cyan(`🚀 Mulai kirim dari ${wallet.address} | Saldo: ${ethers.formatUnits(balance, 18)} MON`));

  while (balance >= MIN_BALANCE) {
    let txs = [];

    for (let i = 0; i < MAX_PARALLEL_TX; i++) {
      const to = targets[Math.floor(Math.random() * targets.length)];
      const currentNonce = nonce; // simpan nonce sekarang
      const tx = {
        to,
        value: AMOUNT,
        gasLimit: 21000,
        gasPrice: GAS_PRICE,
        nonce: nonce++
      };

      txs.push(wallet.sendTransaction(tx)
        .then(sentTx => {
          console.log(chalk.yellow(`📤 ${wallet.address} ${chalk.magenta(`(nonce: ${currentNonce})`)} -> ${to} | Hash: ${chalk.green(sentTx.hash)}`));
          return sentTx.wait(); // tunggu confirm
        })
        .then(receipt => {
          console.log(chalk.green(`✅ Confirmed ${chalk.magenta(`(nonce: ${currentNonce})`)} | Block: ${receipt.blockNumber}`));
        })
        .catch(err => {
          console.log(chalk.red(`❌ Error ${wallet.address} ${chalk.magenta(`(nonce: ${currentNonce})`)} -> ${to} | ${err.message}`));
        })
      );
    }

    // tunggu semua tx di batch ini confirm sebelum lanjut
    await Promise.allSettled(txs);

    // update saldo
    balance = await provider.getBalance(wallet.address);
  }

  console.log(chalk.blue(`🏁 ${wallet.address} selesai, saldo: ${ethers.formatUnits(balance, 18)} MON`));
}

async function main() {
  await Promise.all(wallets.map(sendWithConfirm)); // semua wallet paralel
}

main().catch(console.error);

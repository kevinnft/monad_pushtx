# Monad Push TX

## ✨ Fitur
- Multi-wallet (baca private key dari `wallets.txt`)
- Kirim ke banyak target address (`address.txt`)
- Parallel TX per wallet (default: 3 tx per batch)
- Otomatis berhenti jika saldo wallet < 1 MON
- Menggunakan RPC **Monad Testnet** (`https://rpc.ankr.com/monad_testnet`)

## Setup
```bash
git clone https://github.com/kevinnft/monad_pushtx
cd monad_pushtx
npm init -y && npm install ethers dotenv chalk

```
Buat `wallets.txt` (private key per baris) 

## Jalankan
```bash
node send.js
```

## Config
Edit di `send.js`:
- `MIN_BALANCE` → saldo min berhenti
- `AMOUNT` → jumlah kirim
- `GAS_PRICE` → gas price
- `MAX_PARALLEL_TX` → jumlah tx paralel

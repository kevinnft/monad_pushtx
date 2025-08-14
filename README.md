# Monad Push TX

Script Node.js untuk kirim MON otomatis dari multi-wallet ke banyak alamat.

## Setup
```bash
git clone https://github.com/kevinnft/monad_pushtx
cd monad_pushtx
npm install
```
Buat `wallets.txt` (private key per baris) & `address.txt` (alamat tujuan per baris).

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

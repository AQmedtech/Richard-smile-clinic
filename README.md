# Richard Smile Salem Medical Center — Offline Clinic Hub & Micro EMR

A lightweight, zero-dependency EMR + Public Clinic Website designed to run **100% offline** over a clinic's local Wi-Fi router across laptops, tablets, and phones—with **zero monthly fees**.

## Files Included
- `server.js` — Lightweight Node.js local hub server (no `npm install` needed). Saves all records atomically to `data/clinic-db.json` and creates daily snapshots in `data/backups/`.
- `start-clinic-server.bat` — Windows double-click launcher for `server.js`.
- `emr.html` — Staff Micro EMR Portal (syncs live across all devices on Wi-Fi, with 1-click **Backup** & **Restore**).
- `index.html` — Public Clinic Website (online appointment booking syncs straight to Reception).

## How to Run on the Central Laptop
1. Install **Node.js** (LTS) once on the central clinic laptop.
2. Connect the laptop to your clinic's Wi-Fi router (no internet data required).
3. Double-click **`start-clinic-server.bat`** (or run `node server.js` in terminal).
4. The terminal will print your clinic's local Wi-Fi address, for example:
   `http://192.168.1.105:8080/emr.html`
5. Open that exact address in Chrome/Safari on doctors' phones, nurses' tablets, and the reception laptop.

## Backups & Auto Cloud Sync (Supabase)
- **Automatic Daily Local Backups:** Saved in `data/backups/clinic-backup-YYYY-MM-DD.json`.
- **Automatic Cloud Sync (When Internet Returns):** Click **☁️ Cloud** in the top bar of `emr.html` to enter your Supabase Project URL and API Key. Whenever the central laptop (or a connected device) has internet, it automatically backs up your clinic database to Supabase (`clinic_backups` table).
- **Manual Backup:** Click **💾 Backup** in the top bar of `emr.html` to save a copy to a USB flash drive or Google Drive.
- **Restore on a New Laptop:** Click **📥 Restore** in `emr.html` and select your backup `.json` file.

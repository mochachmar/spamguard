# 🛡️ SpamGuard by QUASAR: AI-Powered Protection Against Digital Scams for Most Vulnerable Businesses

**SpamGuard** adalah aplikasi web cerdas yang dirancang untuk mendeteksi pesan spam menggunakan kecerdasan buatan (AI). Aplikasi ini menyediakan dashboard interaktif dan terintegrasi dengan Web dan Bot Telegram untuk notifikasi serta analisis pesan secara real-time.

---

## ✨ Fitur Utama

- **🧠 Analisis Teks & Gambar:** Deteksi spam dari konten teks dan gambar menggunakan AI.
- **📊 Dashboard Interaktif:** Visualisasi data statistik seperti total pesan, spam terdeteksi, dan jenis-jenis spam.
- **🤖 Integrasi Bot Telegram:** Analisis pesan langsung dari Telegram dan berikan laporan secara instan.
- **📁 Manajemen Pesan:** Riwayat pesan yang dianalisis dapat ditelusuri dan dihapus.
- **⚙️ Pengaturan Fleksibel:** Atur ambang batas deteksi spam dan kata kunci yang diblokir.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- ⚛️ React.js (TypeScript)
- ⚡ Vite
- 🎨 Tailwind CSS
- 📈 Recharts
- 🔗 Axios

### Backend
- 🟩 Node.js dengan Express.js
- 🍃 MongoDB + Mongoose
- 🧠 Gemini API (Google AI) untuk analisis konten
- 🔍 Tesseract.js untuk OCR gambar
- 🤖 Telegraf.js untuk integrasi bot Telegram

---

## ⚙️ Konfigurasi Awal & Instalasi

### 🔧 Prasyarat
Pastikan Anda telah menginstal:
- Node.js v18+
- npm atau yarn
- MongoDB (lokal atau MongoDB Atlas)

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY_ANDA>
cd spamguard-project
```

### 2. Clone Repository

```bash
cd backend
npm install
cp .env.example .env
```

Isi file .env dengan konfigurasi:
```bash
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/spamguard?retryWrites=true&w=majority
API_KEY=KUNCI_API_GEMINI_ANDA
TELEGRAM_BOT_TOKEN=TOKEN_BOT_TELEGRAM_ANDA
TESSERACT_LANG=ind

JWT_SECRET=KUNCI_JWT_SECRET_ANDA
JWT_EXPIRES_IN=90d

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=USERNAME_MAILTRAP_ANDA
EMAIL_PASSWORD=PASSWORD_MAILTRAP_ANDA
```

### 3. Konfigurasi Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Isi file .env dengan konfigurasi:
```bash
VITE_API_URL=http://localhost:5000
```

🚀 Menjalankan Proyek
Jalankan Backend
```bash
cd backend
npm run dev
```

Akses: http://localhost:5000

Jalankan Frontend
```bash
cd ../frontend
npm run dev
```

Akses: http://localhost:5173

Jalankan Bot Telegram
Bot akan otomatis berjalan bersamaan dengan backend.

| Method | Endpoint                     | Deskripsi                             | Contoh Body                                                  |
| ------ | ---------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| POST   | `/ai/analyze-text`           | Menganalisis teks spam                | `{ "text": "Dapatkan diskon 50% sekarang!" }`                |
| POST   | `/ai/analyze-image`          | Menganalisis gambar spam (upload)     | *form-data dengan key `image`*                               |
| GET    | `/dashboard/stats`           | Statistik umum                        | -                                                            |
| GET    | `/dashboard/spam-over-time`  | Statistik spam per hari               | -                                                            |
| GET    | `/dashboard/recent-activity` | Log aktivitas terbaru                 | -                                                            |
| GET    | `/dashboard/spam-types`      | Persentase tipe spam                  | -                                                            |
| GET    | `/messages`                  | Semua pesan yang dianalisis           | -                                                            |
| DELETE | `/messages/:id`              | Hapus pesan berdasarkan ID            | -                                                            |
| GET    | `/settings`                  | Ambil konfigurasi pengaturan saat ini | -                                                            |
| POST   | `/settings`                  | Update konfigurasi pengaturan         | `{ "spamThreshold": 75, "blockedKeywords": "promo,diskon" }` |



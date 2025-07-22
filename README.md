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


<h2>Team Overview 👥</h2>
<div style="display: flex; align-items: center; gap: 8px;">
  <span><strong>Project Manager:</strong> Muhammad Darrel Prawira</span>
  <a href="https://www.linkedin.com/in/dapraws/">
      <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
  </a>
</div>

<h3>AI Division🤖</h3>

<ol>
  <li>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span><strong>AI/ML Engineer :</strong> Riandra Diva Auzan</span>
      <a href="https://www.linkedin.com/in/riandradivaauzan/">
          <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
      </a>
    </div>
  </li>
  <li>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span><strong>Data Engineer :</strong> Moch Achmar</span>
      <a href="https://www.linkedin.com/in/moch-achmar">
          <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
      </a>
    </div>
  </li>
</ol>

<h3>Web Development Division 🌐</h3>

<ol>
  <li><strong>Hipster</strong>
    <ul>
      <li>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Moch Achmar</span>
          <a href="https://www.linkedin.com/in/moch-achmar">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
          </a>
        </div>
      </li>
      <li>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Muhammad Faqih Maulana</span>
          <a href="https://www.linkedin.com/in/faqhmlna/">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
          </a>
        </div>
      </li>
      <li>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Hani Dwi Rahma Yulizar</span>
          <a href="https://www.linkedin.com/in/hani-dwi-rahma-yulizar-597620311/">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
          </a>
        </div>
      </li>
    </ul>
  </li>
  <li><strong>Hacker</strong>
    <ul>
      <li>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Moch Achmar</span>
          <a href="[https://www.linkedin.com/in/muhammad-haykal-islam-baskoro-baskoro-7b6154250/](https://www.linkedin.com/in/moch-achmar)">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
          </a>
        </div>
      </li>
      <li>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Kusdhani Ilham</span>
          <a href="https://www.linkedin.com/in/kusdhani-ilham/">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" style="height: 24px;">
          </a>
        </div>
      </li>
    </ul>
  </li>
</ol>

</br>
</br>

<div style="display: flex; align-items: center;">
  <a href="">
    <img src="" alt="Struktural Project">
  </a>
</div>

<div style="display: flex; align-items: center;">

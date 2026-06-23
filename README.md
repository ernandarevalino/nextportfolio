# 🚀 NextPortfolio - Full-Stack Developer Portfolio with Multi-Language CMS Admin Panel

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

NextPortfolio adalah aplikasi portfolio full-stack modern, dinamis, dan berperforma tinggi yang dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**. 

Aplikasi ini dilengkapi dengan fitur **lokalisasi multibahasa (Indonesia & Inggris)** penuh serta **CMS (Content Management System) Admin Panel** terintegrasi yang aman untuk mengelola seluruh konten secara dinamis (tanpa perlu menyentuh kode program). Data disimpan secara real-time pada **Supabase (PostgreSQL & Storage)**.

---

## 📌 Daftar Isi
1. [🌟 Fitur Utama](#-fitur-utama)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [📁 Struktur Proyek](#-struktur-proyek)
4. [⚙️ Panduan Instalasi & Konfigurasi Lokal](#️-panduan-instalasi--konfigurasi-lokal)
5. [🗄️ Skema Database Supabase (SQL Script)](#️-skema-database-supabase-sql-script)
6. [🪣 Konfigurasi Supabase Storage](#-konfigurasi-supabase-storage)
7. [🔐 Sistem Autentikasi & Keamanan (Middleware)](#-sistem-autentikasi--keamanan-middleware)
8. [🎨 Alur Kerja CMS (Admin Panel)](#-alur-kerja-cms-admin-panel)
9. [🌐 Publik & Internasionalisasi (i18n)](#-publik--internasionalisasi-i18n)
10. [🚀 Deployment ke Vercel](#-deployment-ke-vercel)

---

## 🌟 Fitur Utama

- **🌐 Internasionalisasi Penuh (i18n)**: 
  Mendukung bahasa Indonesia (`id`) dan bahasa Inggris (`en`) yang ditenagai oleh `next-intl`. Seluruh konten seperti bio, keahlian, riwayat, dan detail proyek disimpan dalam format dwibahasa di database dan disajikan secara dinamis kepada pengguna.
- **🔒 Secure Admin Panel & Middleware**:
  CMS Dashboard dilindungi oleh Middleware Next.js yang mengecek token akses JWT (`sb-access-token`) dalam cookie. Pengguna yang tidak terautentikasi akan diarahkan secara otomatis ke halaman `/login`.
- **✍️ CMS Dashboard CRUD Lengkap**:
  Kelola seluruh konten website Anda secara real-time melalui halaman `/admin/dashboard`:
  - **Profil Hero & About**: Ubah nama, jabatan, teks typewriter, link sosial media, hingga foto profil secara langsung.
  - **Skill Set**: Tambah, ubah, atau hapus keterampilan teknis beserta persentase kemahiran dan tooltip multibahasa.
  - **Portfolio**: Tambahkan proyek lengkap dengan judul, deskripsi rinci, kategori, repositori GitHub, gambar utama, serta galeri foto proyek.
  - **Resume / Riwayat Hidup**: Atur riwayat edukasi, pengalaman kerja, dan sertifikasi lengkap dengan penataan nomor urut/indeks (`order_index`).
  - **Inbox Form**: Baca dan hapus pesan/kontak masuk dari formulir publik secara real-time.
- **🧹 Otomasi Pembersihan File Supabase Storage**:
  Ketika gambar profil atau proyek diubah/dihapus, server action akan secara otomatis menghapus file lama dari Supabase Storage Bucket (`portfolio`) untuk mencegah penumpukan sampah berkas.
- **📱 Desain Modern & Responsif (Tailwind v4)**:
  Antarmuka bernuansa gelap (*Dark Mode*) yang sangat profesional, ramah perangkat mobile, navigasi yang mulus, efek teks typewriter dinamis, dan efek interaktif modern.
- **⚡ Scroll Restoration & Motion Reveals**:
  Dilengkapi dengan retorasi posisi scroll khusus klien untuk pengalaman navigasi tanpa hambatan antar halaman publik dan detail proyek.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2.7](https://nextjs.org/) (App Router & Server Actions)
- **Library UI**: [React 19.2.4](https://react.dev/)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
- **Desain & Gaya**: [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
- **Database & Backend-as-a-Service**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` v2.x)
- **Lokalisasi (i18n)**: [next-intl v4.13.0](https://next-intl-docs.vercel.app/)
- **Ikon UI**: [React Icons](https://react-icons.github.io/react-icons/) (Bootstrap Icons & React Icons)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📁 Struktur Proyek

```text
nextportfolio/
├── actions/                  # Next.js Server Actions (CRUD Data & Manajemen File)
│   ├── auth.ts               # Autentikasi Supabase & Manajemen Cookie Session
│   └── portfolio.ts          # Server Actions untuk Profile, Skills, Projects, Resume & Contact
├── app/                      # Next.js App Router
│   ├── [locale]/             # Rute publik multibahasa (ID / EN)
│   │   ├── portfolio/
│   │   │   └── [id]/         # Halaman dinamis detail proyek portfolio
│   │   ├── layout.tsx        # Layout utama publik yang dilokalisasi
│   │   └── page.tsx          # Halaman beranda publik (menggabungkan seluruh seksi)
│   ├── admin/                # Proteksi Rute Admin panel
│   │   ├── dashboard/        # Halaman utama CMS Dashboard Admin
│   │   │   └── page.tsx      # Manajemen visual CRUD (Projects, Hero, About, Skills, Resume, Messages)
│   │   ├── view/             # Halaman editor detail kaya dan galeri proyek
│   │   │   └── page.tsx
│   │   └── page.tsx          # Pengalihan otomatis (Redirect) ke dashboard
│   ├── components/           # Komponen UI Modular
│   │   ├── About.tsx         # Seksi data diri, info kontak, dan tautan bio
│   │   ├── Contact.tsx       # Seksi formulir kontak publik (menyimpan langsung ke DB)
│   │   ├── Header.tsx        # Navigasi atas & tombol pengganti bahasa (ID/EN)
│   │   ├── Hero.tsx          # Seksi sambutan utama dengan typewriter text dwi-bahasa
│   │   ├── Portfolio.tsx     # Seksi pajangan proyek dengan filter kategori interaktif
│   │   ├── Resume.tsx        # Seksi riwayat karir, sertifikat, dan edukasi
│   │   ├── Skills.tsx        # Seksi bar kemajuan keahlian teknis berdasarkan kategori
│   │   ├── ScrollRestoration.tsx # Penanganan restorasi scroll otomatis sisi klien
│   │   └── ScrollReveal.tsx  # Kontainer efek animasi munculan (reveal animation)
│   ├── globals.css           # Styling global & konfigurasi Tailwind CSS v4
│   ├── layout.tsx            # Struktur layout root Next.js
│   └── login/                # Autentikasi Admin
│       └── page.tsx          # Formulir login panel CMS
├── i18n/                     # Konfigurasi Internationalization
│   └── request.ts            # Parser dan pemuat locale translation dictionary
├── lib/                      # Utilitas eksternal
│   └── supabase.ts           # Inisialisasi Klien Tunggal (Singleton Client) Supabase
├── messages/                 # Kamus Bahasa Statis (Sisi UI)
│   ├── en.json               # Kamus Bahasa Inggris
│   └── id.json               # Kamus Bahasa Indonesia
├── public/                   # Folder aset statis (Gambar, Icon, dll.)
├── middleware.ts             # Route Guard (Mencegah akses ilegal ke admin & manajemen lokalisasi)
├── next.config.ts            # Konfigurasi Build & Optimasi Next.js
├── postcss.config.mjs        # Konfigurasi PostCSS untuk integrasi Tailwind v4
├── package.json              # Daftar pustaka & skrip eksekusi proyek
├── tsconfig.json             # Konfigurasi kompilasi TypeScript
└── pnpm-workspace.yaml       # Deskripsi ruang kerja pnpm (jika multi-paket)
```

---

## ⚙️ Panduan Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Prasyarat (Prerequisites)
Pastikan komputer Anda sudah terpasang:
- [Node.js](https://nodejs.org/) (Sangat direkomendasikan versi 18 ke atas ATAU versi 20 LTS)
- [pnpm](https://pnpm.io/installation) (Sebab repositori ini menggunakan lockfile `pnpm-lock.yaml`)

### 2. Kloning Repositori
```bash
git clone https://github.com/ernandarevalino/nextportfolio.git
cd nextportfolio
```

### 3. Pasang Dependensi
Gunakan `pnpm` untuk menginstal seluruh package yang diperlukan:
```bash
pnpm install
```

### 4. Konfigurasi Variabel Lingkungan (Environment Variables)
Buat file baru bernama `.env.local` di direktori utama (*root*) proyek dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anonymous-key
```
> **Catatan Keamanan**: Dilarang membagikan berkas `.env.local` atau mengunggahnya ke repositori publik seperti GitHub.

### 5. Menjalankan Server Pengembangan
Jalankan perintah berikut untuk mengaktifkan server lokal:
```bash
pnpm dev
```
Buka browser Anda dan akses halaman di **[http://localhost:3000](http://localhost:3000)**. 
Untuk masuk ke panel CMS admin, Anda dapat mengakses rute **[http://localhost:3000/admin](http://localhost:3000/admin)** yang akan otomatis mengarahkan ke halaman `/login`.

---

## 🗄️ Skema Database Supabase (SQL Script)

Untuk membuat sistem ini berfungsi, Anda perlu menyiapkan tabel-tabel di database PostgreSQL Supabase Anda. Buka **SQL Editor** pada Dashboard Supabase Anda, lalu salin dan jalankan (Run) skrip SQL lengkap di bawah ini:

```sql
-- ==========================================
-- 1. Tabel Profile (Pengaturan Tampilan Utama & Bio)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profile (
    id integer PRIMARY KEY DEFAULT 1,
    hero_title_id text,
    hero_title_en text,
    hero_name text,
    hero_description_id text,
    hero_description_en text,
    typewriter_words_id text[],
    typewriter_words_en text[],
    github_url text,
    linkedin_url text,
    instagram_url text,
    about_image_url text,
    about_name text,
    about_title_id text,
    about_title_en text,
    about_email text,
    about_phone text,
    about_location_id text,
    about_location_en text,
    about_maps_url text,
    about_heading_id text,
    about_heading_en text,
    about_bio_1_id text,
    about_bio_1_en text,
    about_bio_2_id text,
    about_bio_2_en text,
    CONSTRAINT single_profile_row CHECK (id = 1)
);

-- Menyisipkan data awal kosong untuk Profile
INSERT INTO public.profile (id, hero_name) 
VALUES (1, 'Ernanda Revalino') 
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. Tabel Projects (Data Karya & Galeri Portfolio)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title_id text NOT NULL,
    title_en text NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    github_url text,
    details_id text,
    details_en text,
    gallery_urls text[] DEFAULT '{}'::text[]
);

-- ==========================================
-- 3. Tabel Skills (Keahlian Teknis landing page)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.skills (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL, -- Contoh: 'UI/UX & Frontend Development', 'Soft Skills', 'Backend Development', 'Framework & Other'
    percentage integer NOT NULL,
    tooltip_id text,
    tooltip_en text,
    created_at timestamp with time zone DEFAULT now()
);

-- ==========================================
-- 4. Tabel Resume Profile (Info ringkas CV)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resume_profile (
    id integer PRIMARY KEY DEFAULT 1,
    summary_id text,
    summary_en text,
    location text,
    email text,
    phone text,
    image_url text,
    CONSTRAINT single_resume_profile_row CHECK (id = 1)
);

-- Menyisipkan data awal untuk Resume Profile
INSERT INTO public.resume_profile (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. Tabel Resume Skills (Keahlian khusus pada CV)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resume_skills (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    percentage integer NOT NULL
);

-- ==========================================
-- 6. Tabel Resume Items (Timeline Edukasi, Pengalaman, Sertifikat)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resume_items (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    type text NOT NULL, -- Bernilai: 'education', 'experience', ATAU 'certification'
    title_id text NOT NULL,
    title_en text NOT NULL,
    subtitle_id text,
    subtitle_en text,
    period_id text,
    period_en text,
    description_id text,
    description_en text,
    order_index integer DEFAULT 0
);

-- ==========================================
-- 7. Tabel Contacts (Kotak Masuk Pesan Pengunjung)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
```

---

## 🪣 Konfigurasi Supabase Storage

Aplikasi ini mengunggah gambar profil, gambar utama proyek, dan galeri gambar ke Supabase Storage. Ikuti instruksi ini untuk konfigurasinya:

1. Buka dashboard proyek Supabase Anda dan masuk ke menu **Storage**.
2. Klik **New Bucket** untuk membuat wadah penyimpanan baru.
3. Beri nama bucket tersebut tepat: **`portfolio`**.
4. Setel opsi visibilitas bucket menjadi **Public** agar seluruh tautan gambar dapat diakses secara publik di website Anda tanpa token URL sementara.
5. **Kebijakan Akses (Policies / RLS)**:
   Buat kebijakan (*policies*) agar aplikasi dapat mengelola berkas secara aman:
   - **Allowed SELECT**: Atur agar siapa saja (*Public/All Users*) dapat membaca gambar.
   - **Allowed INSERT, UPDATE, DELETE**: Atur kebijakan khusus bagi pengguna terautentikasi (**Authenticated Users Only**) untuk melakukan operasi tulis, ubah, dan hapus berkas.

---

## 🔐 Sistem Autentikasi & Keamanan (Middleware)

Bagian administratif situs ini sangat aman dan tangguh berkat integrasi keamanan cookie:

- **Autentikasi Supabase**:
  Ketika Admin login melalui formulir di `/login`, fungsi `loginAction` akan meluncurkan verifikasi email & password menggunakan layanan Supabase Auth.
- **Penyimpanan Token Sesi (JWT)**:
  Setelah login berhasil, token akses JWT (`access_token`) akan disimpan ke dalam cookie dengan nama `sb-access-token` dengan atribut `maxAge` yang disesuaikan dengan masa berlaku sesi dari Supabase (default: 1 jam), `sameSite: "lax"`, dan `secure: true` saat di lingkungan produksi (*production*).
- **Next.js Middleware**:
  Middleware (`middleware.ts`) bertindak sebagai pelindung gerbang utama. Setiap kali ada permintaan (*request*) akses menuju jalur `/admin/*`, middleware akan langsung membaca cookie `sb-access-token`. Jika tidak ada token yang valid, middleware langsung menggagalkan request tersebut dan mengalihkan pengguna kembali ke `/login`.

---

## 🎨 Alur Kerja CMS (Admin Panel)

Admin panel dirancang dengan modularitas yang tinggi demi mempermudah manajemen data:

1. **Tab Menu**: Admin dashboard dipisahkan menjadi 6 seksi utama:
   - **Hero**: Mengonfigurasi teks sapaan dinamis beserta teks typewriter Indonesia/Inggris.
   - **About**: Mengelola biodata diri, email, peta lokasi google maps, biografi naratif, dan foto profil.
   - **Skills**: Menambahkan, menyunting kategori keahlian, persentase keahlian, dan tooltip multibahasa.
   - **Resume**: Mengatur info ringkas CV, serta meluncurkan CRUD riwayat kerja/belajar yang diurutkan rapi menggunakan `order_index`.
   - **Projects**: Area daftar proyek dan pengelolaan dasar (Tambah/Hapus/Ubah utama).
   - **Messages**: Berisi daftar pesan dari pengunjung publik. Admin dapat langsung merespons dan menghapus pesan setelah selesai ditindaklanjuti.
2. **Editor Proyek Mendalam (Rich View Editor)**:
   Melalui halaman `/admin/view?id=[project-id]`, Admin disuguhi editor yang kaya fitur untuk:
   - Mengisi deskripsi mendetail multibahasa mengenai proyek (menggunakan elemen area teks yang mendukung pemformatan dasar).
   - Mengunggah banyak gambar galeri tambahan secara instan ke dalam bucket `portfolio` Supabase.
   - Menghapus gambar galeri lama dari storage sekaligus menghapus tautannya di database secara mulus.

---

## 🌐 Publik & Internasionalisasi (i18n)

Situs web publik menggunakan strategi lokalisasi modern demi menjangkau audiens internasional:

- **next-intl Integration**:
  Semua teks statis seperti tombol, placeholder form, nama-nama seksi nav menu dikelola terpusat di `messages/en.json` (Bahasa Inggris) dan `messages/id.json` (Bahasa Indonesia).
- **Rute URL**:
  Sub-halaman publik memiliki format `/id` atau `/en` di URL-nya (contoh: `domain.com/id` atau `domain.com/en`). Namun berkat opsi `localePrefix: 'as-needed'`, rute beranda utama tanpa prefiks (`domain.com/`) akan otomatis menggunakan bahasa utama bawaan yaitu Indonesia (`id`).
- **Dynamic Content Localizer**:
  Saat menampilkan database yang dwibahasa, aplikasi akan mengecek *locale* aktif. Sebagai contoh, jika bahasa aktif adalah `en`, komponen akan otomatis me-render kolom `title_en` dan `details_en`. Jika bahasa aktif adalah `id`, kolom `title_id` dan `details_id` yang akan ditampilkan ke layar pengguna.

---

## 🚀 Deployment ke Vercel

Situs ini sangat optimal untuk di-deploy langsung ke **Vercel** karena merupakan ekosistem alami Next.js:

1. Buat repositori baru di GitHub Anda dan unggah proyek ini ke sana.
2. Masuk ke [Vercel Dashboard](https://vercel.com/) dan buat proyek baru dengan menghubungkan akun GitHub Anda.
3. Impor repositori `nextportfolio`.
4. Di bagian **Environment Variables**, tambahkan dua variabel lingkungan yang telah diatur di lokal Anda:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik tombol **Deploy**. Vercel akan secara otomatis membangun (*build*) aplikasi dan menyajikannya secara online di seluruh dunia dalam hitungan menit!

---

💡 *Proyek ini ditenagai oleh struktur Next.js modern, menawarkan performa tinggi, keamanan andal, dan modularitas yang sangat fleksibel untuk kebutuhan portofolio pribadi Anda.*

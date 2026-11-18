# Patungan

Aplikasi HP (PWA) untuk membagi tagihan makan bareng: voucher, service, dan pajak dibagi sebanding dengan pesanan tiap orang, bagian setiap orang dibulatkan ke atas ke kelipatan Rp100, ringkasan bisa dikirim ke WhatsApp, dan aplikasi tetap jalan tanpa internet.

Kode ini dibuat langkah demi langkah bersama asisten AI di video **"Vibe Coding Aplikasi HP dari Nol"** di kanal YouTube [@iTeachSWE](https://www.youtube.com/@iTeachSWE). Setiap commit adalah satu "titik aman" di video, jadi `git log` bisa diikuti bab demi bab.

- `SPEK.md`: spek satu halaman, termasuk aturan hitung dan contoh hitungan manual (kunci jawaban tes).
- `CLAUDE.md`: aturan kerja untuk asisten AI.

## Menjalankan

Perlu Node.js 20 atau lebih baru.

```bash
npm install
npm run dev            # buka http://localhost:5173 di browser
npm run dev -- --host  # supaya bisa dibuka dari HP di Wi-Fi yang sama
npx vitest run         # jalankan semua tes
npm run build          # hasil siap terbit di folder dist/
npm run preview        # coba hasil build (service worker aktif)
```

Fitur pasang aplikasi dan mode offline di HP baru bisa dicoba setelah aplikasi terbit dengan alamat https, misalnya lewat Vercel atau GitHub Pages.

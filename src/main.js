import './style.css';
import { hitungPatungan } from './hitung.js';

// Semua uang disimpan sebagai rupiah bulat (integer).
const state = {
  menu: [], // { nama, harga, pemakan: [nama orang] }
  orang: [], // nama
};

const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');

document.querySelector('#app').innerHTML = `
  <main>
    <h1>Patungan</h1>

    <section>
      <h2>Menu</h2>
      <ul id="daftar-menu"></ul>
      <form id="form-menu">
        <input name="nama" placeholder="Nama menu" required autocomplete="off" />
        <input name="harga" type="text" inputmode="numeric" pattern="[0-9.]*" placeholder="Harga (Rp)" required autocomplete="off" />
        <button type="submit">Tambah menu</button>
      </form>
    </section>

    <section>
      <h2>Orang</h2>
      <ul id="daftar-orang"></ul>
      <form id="form-orang">
        <input name="nama" placeholder="Nama orang" required autocomplete="off" />
        <button type="submit">Tambah orang</button>
      </form>
    </section>

    <section>
      <h2>Voucher, service, pajak</h2>
      <form id="form-hitung">
        <label>Voucher (Rp)
          <input name="voucher" type="number" inputmode="numeric" min="0" step="1" value="0" />
        </label>
        <label>Service (%)
          <input name="service" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
        <label>Pajak (%)
          <input name="pajak" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
      </form>
      <div id="hasil" aria-live="polite"></div>
    </section>
  </main>
  <div class="bar-bawah">
    <button type="submit" form="form-hitung" class="utama">Hitung</button>
  </div>
`;

const ulMenu = document.querySelector('#daftar-menu');
const ulOrang = document.querySelector('#daftar-orang');
const divHasil = document.querySelector('#hasil');

function tampil() {
  ulMenu.replaceChildren(
    ...state.menu.map((m) => {
      const li = document.createElement('li');
      const nama = document.createElement('span');
      nama.textContent = m.nama;
      const harga = document.createElement('span');
      harga.textContent = rupiah(m.harga);
      const baris = document.createElement('div');
      baris.className = 'baris';
      baris.append(nama, harga);

      // Ketuk nama orang untuk menandai/melepas pemakan menu ini.
      const pilihan = document.createElement('div');
      pilihan.className = 'pilihan';
      for (const orang of state.orang) {
        const tombol = document.createElement('button');
        tombol.type = 'button';
        tombol.className = 'chip';
        tombol.textContent = orang;
        tombol.setAttribute('aria-pressed', String(m.pemakan.includes(orang)));
        tombol.addEventListener('click', () => {
          const i = m.pemakan.indexOf(orang);
          if (i >= 0) m.pemakan.splice(i, 1);
          else m.pemakan.push(orang);
          tampil();
        });
        pilihan.append(tombol);
      }
      li.append(baris, pilihan);
      return li;
    }),
  );
  ulOrang.replaceChildren(
    ...state.orang.map((n) => {
      const li = document.createElement('li');
      li.textContent = n;
      return li;
    }),
  );
  // Hasil lama tidak berlaku lagi kalau data berubah.
  divHasil.replaceChildren();
}

function tampilkanPesan(teks, kelas) {
  const p = document.createElement('p');
  p.className = kelas;
  p.textContent = teks;
  divHasil.replaceChildren(p);
}

// Kotak harga: tampilkan titik ribuan saat mengetik (50300 -> 50.300).
document.querySelector('#form-menu').harga.addEventListener('input', (e) => {
  const angka = e.target.value.replace(/\D/g, '');
  e.target.value = angka ? Number(angka).toLocaleString('id-ID') : '';
});

document.querySelector('#form-menu').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nama = f.nama.value.trim();
  const harga = Number(f.harga.value.replace(/\D/g, ''));
  if (!nama || !Number.isFinite(harga) || harga < 0) return;
  state.menu.push({ nama, harga, pemakan: [] });
  f.reset();
  f.nama.focus();
  tampil();
});

document.querySelector('#form-orang').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nama = f.nama.value.trim();
  if (!nama) return;
  state.orang.push(nama);
  f.reset();
  f.nama.focus();
  tampil();
});

document.querySelector('#form-hitung').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    const hasil = hitungPatungan({
      voucher: Math.round(Number(f.voucher.value) || 0),
      service: Number(f.service.value) || 0,
      pajak: Number(f.pajak.value) || 0,
      menu: state.menu,
    });
    const ul = document.createElement('ul');
    for (const [orang, bagian] of Object.entries(hasil.bagian)) {
      const li = document.createElement('li');
      const nama = document.createElement('span');
      nama.textContent = orang;
      const jumlah = document.createElement('span');
      jumlah.textContent = rupiah(bagian);
      li.append(nama, jumlah);
      ul.append(li);
    }
    const ringkas = document.createElement('p');
    ringkas.textContent = `Total struk ${rupiah(hasil.total)}. Kelebihan ${rupiah(hasil.kelebihan)}.`;
    divHasil.replaceChildren(ul, ringkas);
  } catch (err) {
    tampilkanPesan(err.message, 'galat');
  }
  // Gulirkan ke hasil (atau pesan galat) supaya pengguna tahu tombol bekerja.
  divHasil.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

tampil();

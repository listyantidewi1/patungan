import './style.css';

// Semua uang disimpan sebagai rupiah bulat (integer).
const state = {
  menu: [], // { nama, harga }
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
        <input name="harga" type="number" inputmode="numeric" min="0" step="1" placeholder="Harga (Rp)" required />
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
  </main>
`;

const ulMenu = document.querySelector('#daftar-menu');
const ulOrang = document.querySelector('#daftar-orang');

function tampil() {
  ulMenu.replaceChildren(
    ...state.menu.map((m) => {
      const li = document.createElement('li');
      const nama = document.createElement('span');
      nama.textContent = m.nama;
      const harga = document.createElement('span');
      harga.textContent = rupiah(m.harga);
      li.append(nama, harga);
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
}

document.querySelector('#form-menu').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nama = f.nama.value.trim();
  const harga = Math.round(Number(f.harga.value));
  if (!nama || !Number.isFinite(harga) || harga < 0) return;
  state.menu.push({ nama, harga });
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

tampil();

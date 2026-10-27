const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Hubungkan ke file database SQLite kamu (pastikan namanya sesuai, misal: harasa_pos.db)
const db = new sqlite3.Database('./harasa_pos.db', (err) => {
    if (err) {
        console.error('Gagal terhubung ke SQLite:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite (harasa_pos.db)');
    }
});

// 1. Endpoint Ambil Semua Transaksi
app.get('/api/transactions', (req, res) => {
    const query = `SELECT * FROM transactions ORDER BY id DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ transactions: rows });
    });
});

// 2. Endpoint Simpan Transaksi Baru dari Kasir
app.post('/api/transactions', (req, res) => {
    const { id, date, time, shift_open_time, customer_name, cashier_name, payment_method, cash_received, change_amt, grand_total, refunded } = req.body;
    
    const query = `INSERT INTO transactions (id, date, time, shift_open_time, customer_name, cashier_name, payment_method, cash_received, change_amt, grand_total, refunded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [id, date, time, shift_open_time, customer_name, cashier_name, payment_method, cash_received, change_amt, grand_total, refunded ? 1 : 0];

    db.run(query, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Transaksi berhasil disimpan ke SQLite!', id: id });
    });
});

    // Endpoint Absensi Staf
app.post('/api/attendance', (req, res) => {
    const { id, staff_name, role, type, timestamp } = req.body;
    const query = `INSERT INTO attendance (id, staff_name, role, type, timestamp) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [id, staff_name, role, type, timestamp], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Absensi berhasil disimpan ke SQLite", id: id });
    });
});
// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
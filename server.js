const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Database(path.join(__dirname, 'leads.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    company TEXT NOT NULL,
    address TEXT,
    contact TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    sys4 TEXT,
    appointment_completed TEXT,
    proposal TEXT,
    rs_dollar REAL,
    rm_dollar REAL,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// --- API Routes ---

// GET all leads
app.get('/api/leads', (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
  res.json(leads);
});

// GET single lead
app.get('/api/leads/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// POST create lead
app.post('/api/leads', (req, res) => {
  const b = req.body;
  const stmt = db.prepare(`
    INSERT INTO leads (date, company, address, contact, email, phone, city, sys4, appointment_completed, proposal, rs_dollar, rm_dollar, won, lost, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    b.date || null, b.company, b.address || null, b.contact || null,
    b.email || null, b.phone || null, b.city || null, b.sys4 || null,
    b.appointment_completed || null, b.proposal || null,
    b.rs_dollar || null, b.rm_dollar || null,
    b.won ? 1 : 0, b.lost ? 1 : 0, b.notes || null
  );
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(lead);
});

// PUT update lead
app.put('/api/leads/:id', (req, res) => {
  const b = req.body;
  const stmt = db.prepare(`
    UPDATE leads SET
      date = ?, company = ?, address = ?, contact = ?, email = ?, phone = ?,
      city = ?, sys4 = ?, appointment_completed = ?, proposal = ?,
      rs_dollar = ?, rm_dollar = ?, won = ?, lost = ?, notes = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  const result = stmt.run(
    b.date || null, b.company, b.address || null, b.contact || null,
    b.email || null, b.phone || null, b.city || null, b.sys4 || null,
    b.appointment_completed || null, b.proposal || null,
    b.rs_dollar || null, b.rm_dollar || null,
    b.won ? 1 : 0, b.lost ? 1 : 0, b.notes || null,
    req.params.id
  );
  if (result.changes === 0) return res.status(404).json({ error: 'Lead not found' });
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  res.json(lead);
});

// DELETE lead
app.delete('/api/leads/:id', (req, res) => {
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ITALK Leads app running at http://localhost:${PORT}`);
});


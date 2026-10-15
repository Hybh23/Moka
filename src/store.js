// مخزن البيانات: ملف JSON واحد مع كتابة ذرّية ونسخ احتياطية تلقائية
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const seed = require('./seed');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 40;

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const COLLECTIONS = ['categories', 'items', 'packages', 'tastings', 'gallery', 'leads'];

let db;

function writeAtomic(file, data) {
  const tmp = file + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}

function normalize(d) {
  const base = seed();
  d.settings = { ...base.settings, ...(d.settings || {}) };
  for (const c of COLLECTIONS) if (!Array.isArray(d[c])) d[c] = [];
  return d;
}

function load() {
  if (fs.existsSync(DB_FILE)) {
    db = normalize(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
  } else {
    db = normalize(seed());
    writeAtomic(DB_FILE, JSON.stringify(db, null, 2));
  }
  return db;
}

function backup(reason = 'auto') {
  if (!fs.existsSync(DB_FILE)) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(DB_FILE, path.join(BACKUP_DIR, `db-${stamp}-${reason}.json`));
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();
  while (files.length > MAX_BACKUPS) fs.unlinkSync(path.join(BACKUP_DIR, files.shift()));
}

let lastBackup = 0;
function save() {
  // نسخة احتياطية كل 10 دقائق على الأكثر قبل أي تعديل
  if (Date.now() - lastBackup > 10 * 60 * 1000) { backup(); lastBackup = Date.now(); }
  writeAtomic(DB_FILE, JSON.stringify(db, null, 2));
}

const get = () => db;
const newId = () => crypto.randomBytes(6).toString('hex');

function listBackups() {
  return fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort().reverse()
    .map(f => ({ name: f, size: fs.statSync(path.join(BACKUP_DIR, f)).size }));
}

function restore(obj, reason = 'before-restore') {
  backup(reason);
  db = normalize(obj);
  writeAtomic(DB_FILE, JSON.stringify(db, null, 2));
}

function readBackup(name) {
  if (!/^db-[\w-]+\.json$/.test(name)) return null;
  const f = path.join(BACKUP_DIR, name);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

module.exports = { load, save, get, newId, backup, listBackups, restore, readBackup, COLLECTIONS, DATA_DIR };

/**
 * Richard Smile Salem Medical Center — Local Clinic Hub Server
 * Zero-dependency Node.js server for offline LAN/Wi-Fi sync across laptops & phones.
 *
 * Usage:
 *   node server.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'clinic-db.json');
const CLOUD_CONFIG_FILE = path.join(DATA_DIR, 'cloud-config.json');

// Ensure data and backup directories exist
fs.mkdirSync(BACKUP_DIR, { recursive: true });

function createInitialData() {
  const today = new Date().toISOString().split('T')[0];
  return {
    updatedAt: new Date().toISOString(),
    patients: [
      {
        id: 'RSS-1003',
        name: 'Master Samuel Davou',
        age: 6,
        gender: 'Male',
        phone: '0812 554 8811',
        allergies: 'None Known',
        vitals: { bp: '100/65', temp: '39.2°C', pulse: '112 bpm', weight: '19 kg' },
        complaint: 'High fever, vomiting twice, refusing food for 2 days',
        status: 'Awaiting Consultation',
        registeredAt: `${today} 09:45`
      },
      {
        id: 'RSS-1001',
        name: 'Dung Pam Gyang',
        age: 42,
        gender: 'Male',
        phone: '0803 441 2098',
        allergies: 'Penicillin (Skin Rash)',
        vitals: { bp: '130/85', temp: '37.8°C', pulse: '88 bpm', weight: '74 kg' },
        complaint: 'Persistent fever, severe chills & joint aches',
        status: 'With Doctor',
        registeredAt: `${today} 08:30`
      },
      {
        id: 'RSS-1002',
        name: 'Sarah Bulus',
        age: 27,
        gender: 'Female',
        phone: '0806 912 3340',
        vitals: { bp: '118/76', temp: '36.7°C', pulse: '82 bpm', weight: '68 kg' },
        complaint: 'Active labor contractions',
        status: 'Admitted',
        registeredAt: 'Today, 09:15 AM'
      },
      {
        id: 'RSS-1004',
        name: 'Hannah Luka',
        age: 34,
        gender: 'Female',
        phone: '0703 889 1122',
        vitals: { bp: '120/80', temp: '36.8°C', pulse: '76 bpm', weight: '65 kg' },
        complaint: 'Post-delivery observation',
        status: 'Admitted',
        registeredAt: 'Yesterday, 06:20 PM'
      }
    ],
    consultations: [
      {
        id: 'CNS-001',
        patientId: 'RSS-1001',
        doctorName: 'Dr. Gyang Pam',
        date: 'Today, 09:00 AM',
        diagnosis: 'Acute Severe Malaria + Suspected Typhoid Enteritis',
        notes: 'Patient febrile (37.8°C), epigastric tenderness. Ordered MP and Widal. Dispatched Artemether/Lumefantrine + Paracetamol.'
      }
    ],
    appointments: [
      {
        id: 'APT-01',
        name: 'Choji Bitrus',
        phone: '0809 321 7744',
        department: 'General Consultation',
        date: today,
        notes: 'Hypertension check',
        status: 'Pending'
      }
    ],
    labs: [
      {
        id: 'LAB-01',
        patientId: 'RSS-1001',
        testName: 'Malaria Parasite (MP) & Widal',
        orderedBy: 'Dr. Gyang Pam',
        status: 'Completed',
        result: 'MP ++ (Positive), Widal Reactive 1:160 O&H',
        orderedAt: '09:05 AM'
      },
      {
        id: 'LAB-02',
        patientId: 'RSS-1003',
        testName: 'Full Blood Count (FBC) & Rapid MP',
        orderedBy: 'Dr. Gyang Pam',
        status: 'Pending',
        result: '',
        orderedAt: '10:00 AM'
      }
    ],
    prescriptions: [
      {
        id: 'RX-01',
        patientId: 'RSS-1001',
        medication: 'Artemether/Lumefantrine 80/480mg + Paracetamol 1g',
        dosage: '1 tab BD x 3d | 2 tabs TDS x 3d',
        status: 'Dispensed',
        prescribedAt: '09:10 AM'
      },
      {
        id: 'RX-02',
        patientId: 'RSS-1003',
        medication: 'Artemether Syrup + Paracetamol Syrup',
        dosage: '5ml BD x 3d | 5ml TDS x 3d',
        status: 'Pending',
        prescribedAt: '10:05 AM'
      }
    ],
    wards: {
      male: {
        label: 'Male Ward',
        beds: [
          { bedNo: 'M-01', patientId: 'RSS-1001', diagnosis: 'Severe Malaria & Typhoid Enteritis', admittedAt: 'Today, 09:15 AM' },
          { bedNo: 'M-02', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'M-03', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'M-04', patientId: null, diagnosis: '', admittedAt: '' }
        ]
      },
      female: {
        label: 'Female Ward',
        beds: [
          { bedNo: 'F-01', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'F-02', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'F-03', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'F-04', patientId: null, diagnosis: '', admittedAt: '' }
        ]
      },
      pediatric: {
        label: 'Pediatric Ward',
        beds: [
          { bedNo: 'P-01', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'P-02', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'P-03', patientId: null, diagnosis: '', admittedAt: '' },
          { bedNo: 'P-04', patientId: null, diagnosis: '', admittedAt: '' }
        ]
      },
      labor: {
        label: 'Labor Room',
        beds: [
          { bedNo: 'L-01', patientId: 'RSS-1002', diagnosis: 'Active Labor (G2P1, 39 Weeks)', admittedAt: 'Today, 09:20 AM' },
          { bedNo: 'L-02', patientId: null, diagnosis: '', admittedAt: '' }
        ]
      },
      recovery: {
        label: 'Recovery Ward',
        beds: [
          { bedNo: 'R-01', patientId: 'RSS-1004', diagnosis: 'Post-Delivery Stabilization', admittedAt: 'Yesterday, 06:30 PM' },
          { bedNo: 'R-02', patientId: null, diagnosis: '', admittedAt: '' }
        ]
      }
    }
  };
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = createInitialData();
      writeDBAtomic(initial);
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Failed to read DB:', err);
    return createInitialData();
  }
}

function writeDBAtomic(data) {
  data.updatedAt = new Date().toISOString();
  const tmpFile = DB_FILE + '.tmp';
  const payload = JSON.stringify(data, null, 2);
  fs.writeFileSync(tmpFile, payload, 'utf8');
  fs.renameSync(tmpFile, DB_FILE);

  // Automatic daily snapshot in data/backups/
  const dayStamp = new Date().toISOString().split('T')[0];
  const dailyFile = path.join(BACKUP_DIR, `clinic-backup-${dayStamp}.json`);
  fs.writeFileSync(dailyFile, payload, 'utf8');

  // Mark pending cloud sync and try auto-sync in background
  markPendingCloudSync();
}

// =========================================================
// AUTO CLOUD BACKUP / SUPABASE SYNC
// =========================================================
let pendingCloudSync = false;
let cloudSyncTimer = null;

function readCloudConfig() {
  try {
    if (!fs.existsSync(CLOUD_CONFIG_FILE)) {
      return {
        supabaseUrl: '',
        supabaseKey: '',
        clinicId: 'rssmc-jos',
        autoSync: true,
        lastSyncedAt: null,
        lastStatus: 'Not configured'
      };
    }
    return JSON.parse(fs.readFileSync(CLOUD_CONFIG_FILE, 'utf8'));
  } catch (e) {
    return { supabaseUrl: '', supabaseKey: '', clinicId: 'rssmc-jos', autoSync: true, lastSyncedAt: null, lastStatus: 'Error reading config' };
  }
}

function writeCloudConfig(cfg) {
  fs.writeFileSync(CLOUD_CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
}

function markPendingCloudSync() {
  pendingCloudSync = true;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    const cfg = readCloudConfig();
    if (cfg.autoSync && cfg.supabaseUrl && cfg.supabaseKey) {
      syncToSupabase().catch(() => {});
    }
  }, 3000);
}

function syncToSupabase() {
  return new Promise((resolve) => {
    const cfg = readCloudConfig();
    if (!cfg.supabaseUrl || !cfg.supabaseKey) {
      return resolve({ ok: false, status: 'Not configured' });
    }

    let targetUrl;
    try {
      const base = cfg.supabaseUrl.replace(/\/+$/, '');
      targetUrl = new URL(`${base}/rest/v1/clinic_backups?on_conflict=clinic_id`);
    } catch (e) {
      cfg.lastStatus = 'Invalid Supabase URL';
      writeCloudConfig(cfg);
      return resolve({ ok: false, status: cfg.lastStatus });
    }

    const db = readDB();
    const body = JSON.stringify({
      clinic_id: cfg.clinicId || 'rssmc-jos',
      updated_at: db.updatedAt || new Date().toISOString(),
      payload: db
    });

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: 'POST',
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json',
        'apikey': cfg.supabaseKey,
        'Authorization': `Bearer ${cfg.supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let respText = '';
      res.on('data', chunk => { respText += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          pendingCloudSync = false;
          cfg.lastSyncedAt = new Date().toISOString();
          cfg.lastStatus = 'Synced';
          writeCloudConfig(cfg);
          console.log(`[Cloud Sync] Backed up to Supabase at ${cfg.lastSyncedAt}`);
          resolve({ ok: true, status: 'Synced', lastSyncedAt: cfg.lastSyncedAt });
        } else {
          cfg.lastStatus = `Error ${res.statusCode}: ${respText.slice(0, 120)}`;
          writeCloudConfig(cfg);
          resolve({ ok: false, status: cfg.lastStatus });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      cfg.lastStatus = 'Offline / Timeout (Queued locally)';
      writeCloudConfig(cfg);
      resolve({ ok: false, status: cfg.lastStatus });
    });

    req.on('error', () => {
      cfg.lastStatus = 'Offline (Queued locally)';
      writeCloudConfig(cfg);
      resolve({ ok: false, status: cfg.lastStatus });
    });

    req.write(body);
    req.end();
  });
}

// Retry queued cloud sync every 45 seconds when internet becomes available
setInterval(() => {
  if (!pendingCloudSync) return;
  const cfg = readCloudConfig();
  if (cfg.autoSync && cfg.supabaseUrl && cfg.supabaseKey) {
    syncToSupabase().catch(() => {});
  }
}, 45000);

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  // CORS headers for local network convenience
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  try {
    // 1. GET /api/state — Fetch shared clinic database
    if (req.method === 'GET' && urlPath === '/api/state') {
      return sendJSON(res, 200, readDB());
    }

    // 2. PUT /api/state — Save shared clinic database
    if (req.method === 'PUT' && urlPath === '/api/state') {
      const raw = await readRequestBody(req);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.patients) || !parsed.wards) {
        return sendJSON(res, 400, { error: 'Invalid clinic database payload' });
      }
      writeDBAtomic(parsed);
      return sendJSON(res, 200, { ok: true, updatedAt: parsed.updatedAt });
    }

    // 3. POST /api/appointments — Add online appointment from index.html
    if (req.method === 'POST' && urlPath === '/api/appointments') {
      const raw = await readRequestBody(req);
      const apt = JSON.parse(raw);
      const db = readDB();
      if (!Array.isArray(db.appointments)) db.appointments = [];
      apt.id = apt.id || 'APT-' + String(db.appointments.length + 1).padStart(2, '0');
      apt.status = apt.status || 'Pending';
      db.appointments.unshift(apt);
      writeDBAtomic(db);
      return sendJSON(res, 201, { ok: true, appointment: apt });
    }

    // 3b. Granular Conflict-Safe Endpoints (prevent concurrent overwrites)
    if (req.method === 'POST' && urlPath === '/api/patients') {
      const pt = JSON.parse(await readRequestBody(req));
      const db = readDB();
      pt.id = pt.id || 'RSS-' + (1001 + db.patients.length);
      db.patients.unshift(pt);
      if (pt.appointmentId) {
        const apt = (db.appointments || []).find(a => a.id === pt.appointmentId);
        if (apt) apt.status = 'Checked In';
      }
      writeDBAtomic(db);
      return sendJSON(res, 201, { ok: true, patient: pt, updatedAt: db.updatedAt });
    }

    if (req.method === 'POST' && urlPath === '/api/consultations') {
      const consult = JSON.parse(await readRequestBody(req));
      const db = readDB();
      consult.id = consult.id || 'CNS-' + String((db.consultations || []).length + 1).padStart(3, '0');
      if (!Array.isArray(db.consultations)) db.consultations = [];
      db.consultations.unshift(consult);
      const pt = db.patients.find(p => p.id === consult.patientId);
      if (pt) pt.status = 'Consulted';
      writeDBAtomic(db);
      return sendJSON(res, 201, { ok: true, consultation: consult, updatedAt: db.updatedAt });
    }

    if (req.method === 'POST' && urlPath === '/api/labs') {
      const lab = JSON.parse(await readRequestBody(req));
      const db = readDB();
      lab.id = lab.id || 'LAB-' + String((db.labs || []).length + 1).padStart(2, '0');
      db.labs.unshift(lab);
      writeDBAtomic(db);
      return sendJSON(res, 201, { ok: true, lab, updatedAt: db.updatedAt });
    }

    if (req.method === 'PATCH' && urlPath === '/api/labs') {
      const body = JSON.parse(await readRequestBody(req));
      const db = readDB();
      const lab = db.labs.find(l => l.id === body.id);
      if (!lab) return sendJSON(res, 404, { error: 'Lab order not found' });
      lab.result = body.result;
      lab.status = 'Completed';
      lab.verifiedBy = body.verifiedBy || 'Lab Scientist';
      lab.completedAt = body.completedAt || new Date().toISOString();
      writeDBAtomic(db);
      return sendJSON(res, 200, { ok: true, lab, updatedAt: db.updatedAt });
    }

    if (req.method === 'POST' && urlPath === '/api/prescriptions') {
      const rx = JSON.parse(await readRequestBody(req));
      const db = readDB();
      rx.id = rx.id || 'RX-' + String((db.prescriptions || []).length + 1).padStart(2, '0');
      db.prescriptions.unshift(rx);
      writeDBAtomic(db);
      return sendJSON(res, 201, { ok: true, rx, updatedAt: db.updatedAt });
    }

    if (req.method === 'PATCH' && urlPath === '/api/prescriptions') {
      const body = JSON.parse(await readRequestBody(req));
      const db = readDB();
      const rx = db.prescriptions.find(r => r.id === body.id);
      if (!rx) return sendJSON(res, 404, { error: 'Prescription not found' });
      rx.status = 'Dispensed';
      rx.dispensedBy = body.dispensedBy || 'Pharmacist';
      rx.dispensedAt = body.dispensedAt || new Date().toISOString();
      writeDBAtomic(db);
      return sendJSON(res, 200, { ok: true, rx, updatedAt: db.updatedAt });
    }

    if (req.method === 'PATCH' && urlPath === '/api/wards') {
      const body = JSON.parse(await readRequestBody(req));
      const db = readDB();
      const ward = db.wards[body.wardKey];
      if (!ward || !ward.beds[body.bedIdx]) return sendJSON(res, 404, { error: 'Bed not found' });
      const bed = ward.beds[body.bedIdx];
      if (body.action === 'admit') {
        bed.patientId = body.patientId;
        bed.diagnosis = body.diagnosis || 'Inpatient Admission';
        bed.admittedAt = body.admittedAt;
        const pt = db.patients.find(p => p.id === body.patientId);
        if (pt) pt.status = 'Admitted';
      } else if (body.action === 'discharge') {
        const pt = db.patients.find(p => p.id === bed.patientId);
        if (pt) pt.status = 'Discharged';
        bed.patientId = null;
        bed.diagnosis = '';
        bed.admittedAt = '';
      }
      writeDBAtomic(db);
      return sendJSON(res, 200, { ok: true, updatedAt: db.updatedAt });
    }

    // 4. GET /api/backup — Download full JSON backup for USB/Cloud safety
    if (req.method === 'GET' && urlPath === '/api/backup') {
      const db = readDB();
      const dateStr = new Date().toISOString().split('T')[0];
      return sendJSON(res, 200, db, {
        'Content-Disposition': `attachment; filename="rssmc-backup-${dateStr}.json"`
      });
    }

    // 5. POST /api/restore — Restore database from a backup JSON file
    if (req.method === 'POST' && urlPath === '/api/restore') {
      const raw = await readRequestBody(req);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.patients) || !parsed.wards) {
        return sendJSON(res, 400, { error: 'Invalid backup file format' });
      }
      writeDBAtomic(parsed);
      return sendJSON(res, 200, { ok: true, updatedAt: parsed.updatedAt });
    }

    // 5b. GET /api/cloud-config — Get Supabase cloud backup settings & status
    if (req.method === 'GET' && urlPath === '/api/cloud-config') {
      const cfg = readCloudConfig();
      return sendJSON(res, 200, {
        ...cfg,
        pendingCloudSync
      });
    }

    // 5c. POST /api/cloud-config — Save Supabase cloud backup settings
    if (req.method === 'POST' && urlPath === '/api/cloud-config') {
      const raw = await readRequestBody(req);
      const incoming = JSON.parse(raw);
      const current = readCloudConfig();
      const updated = {
        ...current,
        supabaseUrl: (incoming.supabaseUrl || '').trim(),
        supabaseKey: (incoming.supabaseKey || '').trim(),
        clinicId: (incoming.clinicId || 'rssmc-jos').trim(),
        autoSync: incoming.autoSync !== false
      };
      writeCloudConfig(updated);
      const result = await syncToSupabase();
      return sendJSON(res, 200, { ok: true, config: readCloudConfig(), syncResult: result });
    }

    // 5d. POST /api/cloud-sync — Trigger immediate Supabase cloud backup
    if (req.method === 'POST' && urlPath === '/api/cloud-sync') {
      const result = await syncToSupabase();
      return sendJSON(res, 200, { ...result, config: readCloudConfig() });
    }

    // 6. Static File Serving (index.html, emr.html)
    let filePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const resolved = path.resolve(ROOT_DIR, filePath);

    // Prevent directory traversal
    if (!resolved.startsWith(ROOT_DIR) || resolved.startsWith(DATA_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      const ext = path.extname(resolved).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      return fs.createReadStream(resolved).pipe(res);
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (err) {
    console.error('Server error:', err);
    sendJSON(res, 500, { error: err.message || 'Internal Server Error' });
  }
});

function getLocalIPs() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

server.listen(PORT, '0.0.0.0', () => {
  // Ensure DB exists on first boot
  readDB();
  const ips = getLocalIPs();
  console.log('\n==============================================================');
  console.log('  Richard Smile Salem Medical Center — Local Clinic Hub');
  console.log('==============================================================');
  console.log(`  Local Laptop Access : http://localhost:${PORT}/emr.html`);
  if (ips.length > 0) {
    ips.forEach(ip => {
      console.log(`  Phone / Wi-Fi Access: http://${ip}:${PORT}/emr.html`);
      console.log(`  Public Clinic Page  : http://${ip}:${PORT}/index.html`);
    });
  } else {
    console.log('  Connect this laptop to your clinic Wi-Fi router to share with phones.');
  }
  console.log(`\n  Database File : ${DB_FILE}`);
  console.log(`  Daily Backups : ${BACKUP_DIR}`);
  console.log('==============================================================\n');
});

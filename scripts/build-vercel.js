const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.html');
const DIST = path.join(ROOT, 'dist');

function loadLocalEnv() {
  const candidates = [
    path.join(ROOT, '.env'),
    path.join(ROOT, '..', '.env')
  ];

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) process.env[key] = value;
    }
  }
}

function normalizeSupabaseUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try { return new URL(raw).origin; }
  catch { return raw.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, ''); }
}

function jsString(value) {
  return JSON.stringify(String(value || ''));
}

loadLocalEnv();

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !anonKey) {
  throw new Error('Faltan SUPABASE_URL y/o SUPABASE_ANON_KEY. Configuralas en Vercel Environment Variables.');
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

let html = fs.readFileSync(SRC, 'utf8');
html = html
  .replace('"__SUPABASE_URL__"', jsString(supabaseUrl))
  .replace('"__SUPABASE_ANON_KEY__"', jsString(anonKey));

fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');

console.log('Landing Vercel generada en dist/');
console.log(`Supabase URL: ${supabaseUrl.replace(/^https:\/\/([^.]+)\./, 'https://***.')}`);

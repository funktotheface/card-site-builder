import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import Ajv from 'ajv';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const dataDir = path.join(process.cwd(), 'data');
const sitesPath = path.join(dataDir, 'sites.json');
const siteSchemaPath = path.join(dataDir, 'sitesSchema.json');
const cardSchemaPath = path.join(dataDir, 'cardSchema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const cardSchema = JSON.parse(fs.readFileSync(cardSchemaPath, 'utf8'));
const siteSchema = JSON.parse(fs.readFileSync(siteSchemaPath, 'utf8'));
ajv.addSchema(cardSchema, 'card');
const validateSite = ajv.compile(siteSchema);

const readSites = () => JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
const writeSites = (sites) => fs.writeFileSync(sitesPath, JSON.stringify(sites, null, 2));

const normalizeCard = (card) => {
  if (!card) return card;
  const normalized = { ...card };
  if (!normalized.content && normalized.data) {
    normalized.content = normalized.data;
  }
  delete normalized.data;
  return normalized;
};

const normalizeSite = (site) => {
  if (!site) return site;
  const normalized = { ...site };
  normalized.slug = normalized.slug || normalized.meta?.slug;
  if (Array.isArray(normalized.cards)) {
    normalized.cards = normalized.cards.map(normalizeCard);
  }
  return normalized;
};

app.get('/sites/:slug', (req, res) => {
  const { slug } = req.params;
  const sites = readSites().map(normalizeSite);
  const site = sites.find((s) => s.slug === slug || s.meta?.slug === slug);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  res.json(site);
});

// GET /sites
app.get('/sites', (_req, res) => {
  const sites = readSites().map(normalizeSite);
  res.json(sites.map((s) => ({ id: s.id, name: s.name || s.meta?.name, slug: s.slug || s.meta?.slug, status: s.status })));
});

app.post('/sites', (req, res) => {
  const incoming = normalizeSite(req.body);
  const sites = readSites().map(normalizeSite);

  if (sites.some((s) => s.slug === incoming.slug)) {
    return res.status(409).json({ error: 'Slug already exists' });
  }

  const valid = validateSite(incoming);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid site payload', details: validateSite.errors });
  }

  sites.push(incoming);
  writeSites(sites);
  res.status(201).json(incoming);
});

// PUT /sites/:slug (replace)
app.put('/sites/:slug', (req, res) => {
  const { slug } = req.params;
  const incoming = normalizeSite(req.body);
  const sites = readSites().map(normalizeSite);

  const idx = sites.findIndex((s) => s.slug === slug || s.meta?.slug === slug);
  if (idx === -1) return res.status(404).json({ error: 'Site not found' });

  const targetSlug = incoming.slug || incoming.meta?.slug;
  const conflict = sites.find((s, i) => i !== idx && (s.slug === targetSlug || s.meta?.slug === targetSlug));
  if (conflict) return res.status(409).json({ error: 'Slug already exists' });

  const valid = validateSite(incoming);
  if (!valid) return res.status(400).json({ error: 'Invalid site payload', details: validateSite.errors });

  sites[idx] = incoming;
  writeSites(sites);
  res.json(incoming);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

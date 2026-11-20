'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const articles = [
  'creche-ou-assistante-maternelle-2026',
  '15-achats-indispensables-avant-bebe',
  'conge-parental-ou-reprise-travail-2026',
  'livret-a-enfant-epargne-naissance',
];
const index = fs.readFileSync('app/blog/page.tsx','utf8');
const sitemap = fs.readFileSync('app/sitemap.ts','utf8');
const sidebar = fs.readFileSync('components/BlogArticleFrame.tsx','utf8');
const sourcePattern = /url:\s*'(https:\/\/[^']+)'/g;
for (const slug of articles) {
  const path = 'app/blog/' + slug;
  const page = fs.readFileSync(path + '/page.tsx','utf8');
  const layout = fs.readFileSync(path + '/layout.tsx','utf8');
  const href = '/blog/' + slug;
  assert.ok(index.includes(href), slug + ' missing blog card');
  assert.ok(sitemap.includes(href), slug + ' missing sitemap');
  assert.ok(sidebar.includes(href), slug + ' missing sidebar');
  assert.ok(layout.includes(href), slug + ' missing canonical');
  assert.ok(page.includes('BlogArticleFrame'), slug + ' missing editorial frame');
  assert.ok(/questions fréquentes/i.test(page), slug + ' missing reader FAQ');
  const sourceUrls = [...page.matchAll(sourcePattern)].map(m => m[1]);
  assert.ok(sourceUrls.length >= 5, slug + ' missing official references');
  assert.equal(new Set(sourceUrls).size, sourceUrls.length, slug + ' duplicated sources');
  assert.ok(sourceUrls.every(x => /^https:\/\/(www\.)?(caf\.fr|service-public\.gouv\.fr|urssaf\.fr|ameli\.fr|economie\.gouv\.fr|banque-france\.fr|modules\.securite-routiere\.gouv\.fr|rappel\.conso\.gouv\.fr)/.test(x)),
    slug + ' has an unsanctioned source host');
  const approximateWords = page.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
  assert.ok(approximateWords >= 1400, slug + ' unexpectedly short');
}
const budget = fs.readFileSync('app/budget/page.tsx','utf8');
assert.ok(budget.includes('RESSOURCES_PLANCHER_CRECHE = 814.62'), '2026 CAF floor mismatch');
assert.ok(!budget.includes('RESSOURCES_PLANCHER_CRECHE = 821.13'), '2027 floor wrongly used in 2026');
console.log('Blog editorial checks: 4 articles, official sources, internal links, sitemap and CAF 2026 floor PASS');

'use strict';

// Checks only the locally built app against a fake Supabase endpoint.
// No test signs in, sends personal data, or writes to any database.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3123';
const failures = [];
let passed = 0;

async function main() {
  const browser = await chromium.launch({ headless: true });
  async function check(name, fn, viewport = { width: 1280, height: 800 }) {
    const context = await browser.newContext({ viewport, locale: 'fr-FR' });
    const page = await context.newPage();
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    try {
      await fn(page);
      assert.deepEqual(jsErrors, [], 'Uncaught browser JavaScript errors');
      console.log('PASS ' + name);
      passed += 1;
    } catch (error) {
      failures.push({ name, message: error.message });
      console.error('FAIL ' + name + ': ' + error.message);
    } finally {
      await context.close();
    }
  }

  await check('Homepage shows product proposition and account CTA', async page => {
    const response = await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    await page.getByRole('heading', { name: /Grandir ensemble/i }).waitFor();
    await page.getByRole('link', { name: /Créer mon compte/i }).first().waitFor();
    assert.equal(await page.locator('a.bb-home-link').count(), 1);
  });

  await check('Desktop navigation reaches public calculator', async page => {
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: /Budget estimé/i }).click();
    await page.waitForURL('**/budget');
    assert.equal(new URL(page.url()).pathname, '/budget');
  });

  await check('Mobile menu opens, Escape closes, links navigate', async page => {
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    const toggle = page.getByRole('button', { name: 'Ouvrir le menu' });
    await toggle.click();
    const mobileNav = page.getByRole('navigation', { name: 'Navigation mobile' });
    await mobileNav.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await mobileNav.waitFor({ state: 'hidden' });
    await toggle.click();
    await mobileNav.getByRole('link', { name: /Budget estimé/i }).click();
    await page.waitForURL('**/budget');
  }, { width: 390, height: 844 });

  await check('Theme switch persists after refresh', async page => {
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Activer le mode sombre' }).click();
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Activer le mode clair' }).waitFor();
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), true);
  });

  await check('Dark theme remains active across public navigation', async page => {
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Activer le mode sombre' }).click();
    for (const route of ['/budget', '/comparaison', '/informations', '/blog', '/login']) {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), true,
        'Dark theme lost on ' + route);
    }
  });

  await check('Login email, password, reveal and reset mode', async page => {
    await page.goto(origin + '/login', { waitUntil: 'domcontentloaded' });
    await page.locator('#email').fill('test@example.invalid');
    await page.locator('#password').fill('not-a-real-password');
    assert.equal(await page.locator('#password').getAttribute('type'), 'password');
    await page.locator('button.lr-eye').click();
    assert.equal(await page.locator('#password').getAttribute('type'), 'text');
    const resetLink = page.getByRole('button', { name: /mot de passe oublié/i });
    await resetLink.click();
    await page.getByRole('heading', { name: /mot de passe oublié/i }).waitFor();
    await page.locator('#reset-email').waitFor();
  });

  await check('Signup form is editable without submitting', async page => {
    await page.goto(origin + '/signup', { waitUntil: 'domcontentloaded' });
    await page.locator('#email').fill('test@example.invalid');
    await page.locator('#password').fill('safeExample8!');
    await page.locator('#confirm').fill('safeExample8!');
    assert.equal(await page.locator('#email').inputValue(), 'test@example.invalid');
    assert.equal(await page.locator('#confirm').inputValue(), 'safeExample8!');
    await page.locator('button.sr-eye').first().click();
    assert.equal(await page.locator('#password').getAttribute('type'), 'text');
  });

  await check('Budget simulator slider accepts input', async page => {
    await page.goto(origin + '/budget', { waitUntil: 'domcontentloaded' });
    const slider = page.locator('input[type="range"]').first();
    await slider.waitFor();
    const initial = Number(await slider.inputValue());
    await slider.focus();
    await slider.press('ArrowRight');
    const later = Number(await slider.inputValue());
    assert.notEqual(later, initial, 'Slider value must respond to keyboard arrow');
  });

  await check('CAF amounts default to zero and user-entered aids are reflected', async page => {
    await page.goto(origin + '/budget', { waitUntil: 'domcontentloaded' });
    const cmg = page.locator('#budget-cmg');
    const paje = page.locator('#budget-paje');
    assert.equal(await cmg.inputValue(), '0');
    assert.equal(await paje.inputValue(), '0');
    await cmg.fill('120');
    await paje.fill('80');
    assert.equal(await cmg.inputValue(), '120');
    assert.equal(await paje.inputValue(), '80');
    await page.getByText('PAJE renseignée', { exact: true }).first().waitFor();
    await page.getByText('CMG saisi', { exact: true }).first().waitFor();
  });

  await check('Comparison acknowledges illustrative estimates rather than national statistics', async page => {
    await page.goto(origin + '/comparaison', { waitUntil: 'domcontentloaded' });
    await page.getByText(/hypothèses budgétaires illustratives/i).first().waitFor();
    assert.equal(await page.getByText(/vous êtes plus économe que \d+%/i).count(), 0);
  });

  await check('Brand identity: SVG symbol, favicon, iPhone and social media assets', async page => {
    const res = await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    assert.equal(res.status(), 200);
    const brand = page.getByRole('navigation', { name: 'Navigation principale' }).locator('img.bb-brand-symbol');
    await brand.waitFor();
    assert.ok((await brand.getAttribute('src')).includes('/brand-symbol.svg'));
    const meta = await page.locator('meta[property="og:image"]').getAttribute('content');
    assert.ok(meta.includes('/og-image.png'), 'Open Graph must use the matching new image');
    const twitter = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    assert.ok(twitter.includes('/og-image.png'), 'Twitter image must match Open Graph');
    for (const path of ['/favicon.ico','/favicon.svg','/apple-touch-icon.png',
      '/icon-192.png','/icon-512.png','/icon-maskable-512.png','/og-image.png','/og-image.jpg']) {
      const resource = await page.request.get(origin + path);
      assert.equal(resource.status(), 200, 'Missing identity asset: ' + path);
      assert.ok(Number(resource.headers()['content-length'] || 1) > 0);
    }
  });

  await check('Updated blog posts reflect official CAF amounts and conservative claims', async page => {
    await page.goto(origin + '/blog', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: /Aides CAF bébé 2026/i }).first().waitFor();
    await page.goto(origin + '/blog/aides-caf-bebe-2026', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Aides CAF pour bébé en 2026/i }).waitFor();
    assert.ok((await page.locator('article').innerText()).includes('1 093,08 €'));
    assert.ok((await page.locator('article').innerText()).includes('ne calcule pas automatiquement'));
    await page.goto(origin + '/blog/cout-bebe-premiere-annee', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Combien coûte un bébé la première année/i }).waitFor();
    assert.ok((await page.locator('article').innerText()).includes('exemple entièrement illustratif'));
  });

  await check('Protected dashboard redirects anonymous visitor to login', async page => {
    await page.goto(origin + '/app', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/login', { timeout: 15000 });
  });

  await check('Anonymous visitors cannot access forecasts or recurring payments', async page => {
    for (const route of ['/analyse', '/previsions', '/recurrences']) {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/login', { timeout: 15000 });
    }
  });

  await check('Nonexistent route presents a 404', async page => {
    const response = await page.goto(origin + '/route-qui-n-existe-pas-9287', { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 404);
  });

  for (const route of ['/', '/login', '/signup', '/budget', '/comparaison', '/informations', '/blog']) {
    await check('No horizontal overflow on mobile ' + route, async page => {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        body: document.body.scrollWidth,
        root: document.documentElement.scrollWidth
      }));
      assert.ok(metrics.root <= metrics.viewport + 6 && metrics.body <= metrics.viewport + 6,
        'Horizontal overflow: ' + JSON.stringify(metrics));
    }, { width: 390, height: 844 });
  }

  await browser.close();
  console.log('Browser smoke test summary: ' + passed + ' passed / ' + failures.length + ' failed.');
  if (failures.length) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exitCode = 1; });

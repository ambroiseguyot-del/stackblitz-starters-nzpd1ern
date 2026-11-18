// Regenerate all public identity assets from the single brand-symbol.svg source.
// Requires the 'sharp' dependency installed transitively by Next.js. Zero external API calls.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const pub = path.resolve(__dirname, '..', 'public');
const svg = fs.readFileSync(path.join(pub, 'brand-symbol.svg'), 'utf8');

async function raster(size) {
  return sharp(Buffer.from(svg), { density: 300 }).resize(size, size, { fit: 'contain' }).png().toBuffer();
}
async function brandedSquare(size, maskable = false) {
  const pad = maskable ? Math.round(size * .23) : Math.round(size * .1);
  const symbol = await sharp(Buffer.from(svg), { density: 300 }).resize(size - 2 * pad).png().toBuffer();
  return sharp({ create: { width:size, height:size, channels:4, background:'#F8F8F4' } })
    .composite([{ input:symbol, top:pad, left:pad }]).png().toBuffer();
}
function makeIco(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  for (let i=0;i<images.length;i++) {
    const {size, data} = images[i]; const j=6+16*i;
    header.writeUInt8(size===256?0:size,j); header.writeUInt8(size===256?0:size,j+1);
    header.writeUInt8(0,j+2); header.writeUInt8(0,j+3);
    header.writeUInt16LE(1,j+4); header.writeUInt16LE(32,j+6);
    header.writeUInt32LE(data.length,j+8); header.writeUInt32LE(offset,j+12);
    offset+=data.length;
  }
  return Buffer.concat([header, ...images.map(x=>x.data)]);
}
async function main() {
  const sizes=[16,32,48,180,192,512];
  const pngs={};
  for (const size of sizes) pngs[size]=await raster(size);
  fs.writeFileSync(path.join(pub,'favicon-16x16.png'),pngs[16]);
  fs.writeFileSync(path.join(pub,'favicon-32x32.png'),pngs[32]);
  fs.writeFileSync(path.join(pub,'favicon.ico'),makeIco([16,32,48].map(size=>({size,data:pngs[size]}))));
  fs.writeFileSync(path.join(pub,'apple-touch-icon.png'),await brandedSquare(180));
  fs.writeFileSync(path.join(pub,'icon-192.png'),await brandedSquare(192));
  fs.writeFileSync(path.join(pub,'icon-512.png'),await brandedSquare(512));
  fs.writeFileSync(path.join(pub,'icon-maskable-512.png'),await brandedSquare(512,true));
  const inner=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/<title[^>]*>[\s\S]*?<\/title>/,'');
  const og=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F8F8F4"/><stop offset="1" stop-color="#EAF3E7"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="30" y="30" width="1140" height="570" rx="34" fill="#FFFFFF" stroke="#DCE9D9" stroke-width="2"/>
    <rect x="75" y="130" width="320" height="320" rx="76" fill="#EEF5E9"/>
    <svg x="101" y="156" width="268" height="268" viewBox="0 0 256 256">${inner}</svg>
    <text x="440" y="246" fill="#16443D" font-family="DejaVu Sans,Arial,sans-serif" font-size="76" font-weight="bold" letter-spacing="-3">Baby Budget</text>
    <text x="443" y="309" fill="#315B4B" font-family="DejaVu Sans,Arial,sans-serif" font-size="26">Le budget de votre famille, en toute clarté.</text>
    <path d="M444 346H1083" stroke="#D5E5D6" stroke-width="3"/>
    <text x="444" y="403" fill="#16443D" font-family="DejaVu Sans,Arial,sans-serif" font-size="25">Suivez les dépenses de votre enfant.</text>
    <text x="444" y="445" fill="#16443D" font-family="DejaVu Sans,Arial,sans-serif" font-size="25">Anticipez les mois à venir.</text>
    <text x="443" y="526" fill="#648672" font-family="DejaVu Sans,Arial,sans-serif" font-size="22">babybudget.fr</text>
  </svg>`;
  fs.writeFileSync(path.join(pub,'og-image.png'),await sharp(Buffer.from(og)).png({compressionLevel:9}).toBuffer());
  console.log('Generated favicon.ico, sizes 16/32/180/192/512, maskable and OG 1200x630.');
}
main().catch(err=>{console.error(err);process.exitCode=1});

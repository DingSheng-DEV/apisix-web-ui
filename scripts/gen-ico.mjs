import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';

const srcPng = path.resolve(process.cwd(), 'public/image.png');
const outIco = path.resolve(process.cwd(), 'public/app.ico');

async function main() {
  if (!fs.existsSync(srcPng)) {
    console.error(`[gen-ico] source PNG not found: ${srcPng}`);
    process.exit(1);
  }
  try {
    const buf = await pngToIco(srcPng);
    fs.writeFileSync(outIco, buf);
    console.log(`[gen-ico] generated ${outIco}`);
  } catch (err) {
    console.error('[gen-ico] failed to generate ico:', err);
    process.exit(1);
  }
}

main();

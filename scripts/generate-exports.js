const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../');
const TARGET_DIR = path.resolve(__dirname, '../');

function escapeSource(src) {
  return src.replace(/'/g, "\\'");
}

const dtsSource =
`declare const source: string;
export = source;
`

function generate() {
  console.log('Generating js exports...')
  fs.readdir(SRC_DIR, (err, filenames) => {
    if (err) {
      throw err;
    }
    
    filenames.forEach(filename => {
      if (!filename.endsWith('.svg')) {
        return
      }
      const jsFileName = filename.replace('.svg', '.js');
      
      const fileContent = fs.readFileSync(`${SRC_DIR}/${filename}`, 'utf-8');
      const source = `module.exports = '${escapeSource(fileContent)}';`;
      
      fs.writeFileSync(path.join(TARGET_DIR, jsFileName), source);
      console.log(`Generated ${jsFileName}`)

      const dtsFileName = filename.replace('.svg', '.d.ts');
      fs.writeFileSync(path.join(TARGET_DIR, dtsFileName), dtsSource);
      console.log(`Generated ${dtsFileName}`)
    });

    console.log('JS exports generated successfully');
  });
}

generate();

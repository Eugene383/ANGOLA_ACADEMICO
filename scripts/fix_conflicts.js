const fs = require('fs');
const path = require('path');
const exts = ['.ts','.tsx','.js','.jsx','.json','.md'];

function walk(dir){
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const res = path.resolve(dir, dirent.name);
    if(dirent.isDirectory()){
      if(dirent.name === 'node_modules' || dirent.name === '.git') return;
      results = results.concat(walk(res));
    } else {
      if(exts.includes(path.extname(res))) results.push(res);
    }
  });
  return results;
}

const files = walk(process.cwd());
let changed = 0;
const pattern = /<<<<<<< HEAD(?::[^\r\n]*)?[\r\n]+([\s\S]*?)[\r\n]+=======[\s\S]*?>>>>>>>.*?[\r\n]*/g;
files.forEach(file => {
  try{
    const text = fs.readFileSync(file, 'utf8');
    const newText = text.replace(pattern, '$1');
    if(newText !== text){
      fs.writeFileSync(file, newText, 'utf8');
      console.log('Fixed:', file);
      changed++;
    }
  }catch(e){/* ignore */}
});
console.log('Done. Files changed:', changed);

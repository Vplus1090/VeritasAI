import fs from 'fs';
import path from 'path';

console.log('--- DEPENDENCY CHECK START ---');
try {
  const nodeModules = path.resolve('node_modules');
  if (fs.existsSync(nodeModules)) {
    console.log('node_modules exists at:', nodeModules);
    const reactMarkdown = path.join(nodeModules, 'react-markdown');
    if (fs.existsSync(reactMarkdown)) {
      console.log('react-markdown FOUND at:', reactMarkdown);
      console.log('Contents:', fs.readdirSync(reactMarkdown));
    } else {
      console.error('react-markdown NOT FOUND in node_modules');
      console.log('Top level modules:', fs.readdirSync(nodeModules).filter(n => n.startsWith('react')));
    }
  } else {
    console.error('node_modules directory NOT FOUND');
  }
} catch (e) {
  console.error('Error checking dependencies:', e);
}
console.log('--- DEPENDENCY CHECK END ---');

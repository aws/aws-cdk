//
// align versions of "peerDependencies" and "dependencies" for a given set of package.json files
// usage: node sync-peer-deps.js package.json pacakge.json ...
//
const fs = require('fs');

for (const file of process.argv.splice(2)) {
  const pkg = JSON.parse(fs.readFileSync(file).toString());
  const deps = pkg.dependencies || { };
  let updated = false;
  if (pkg.peerDependencies) {
    for (const dep of Object.keys(pkg.peerDependencies)) {
      const version = deps[dep];
      const peerVersion = pkg.peerDependencies[dep];
      if (version && version !== peerVersion) {
        pkg.peerDependencies[dep] = version;
        updated = true;
      }
    }
  }
  if (updated) {
    console.log('updated:', file);
    fs.writeFileSync(file, JSON.stringify(pkg, undefined, 2));
  }
}
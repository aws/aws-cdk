const lerna_project = require('@lerna/project');
const fs = require('fs-extra');

bringBackDependencies();

function bringBackDependencies() {
    const project = new lerna_project.Project();
    const separatePackages = project.getPackagesSync();
    for (const separatePkg of separatePackages) {
        const pkgJson = fs.readJsonSync(separatePkg.manifestLocation);
        pkgJson.devDependencies = pkgJson.tmp_devDependencies;
        pkgJson.peerDependencies = pkgJson.tmp_peerDependencies;
        pkgJson.tmp_devDependencies = undefined;
        pkgJson.tmp_peerDependencies = undefined;
        fs.writeJsonSync(separatePkg.manifestLocation, pkgJson, {spaces: 2});
    }
}

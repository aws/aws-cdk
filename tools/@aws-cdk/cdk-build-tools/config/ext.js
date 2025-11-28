// In a separate file because this logic needs to be shared between files
//
// On developer boxes we want to run the .ts files directly for quickest
// iteration (save -> run), but on CI machines we want to run the compiled
// JavaScript for highest throughput.

const isCi = !!process.env.CI || !!process.env.CODEBUILD_BUILD_ID;
module.exports = isCi ? 'js' : 'ts';
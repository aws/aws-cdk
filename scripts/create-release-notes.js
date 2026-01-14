#!/usr/bin/env node
/**
 * Generates release notes for the AWS CDK.
 * 
 * Creates RELEASE_NOTES.md from changelog files using the cdk-release package.
 * Supports both stable and alpha changelog formats.
 */
const cdkRelease = require('@aws-cdk/cdk-release');
const ver = require('./resolve-version');

async function main() {
  console.error('📝 Generating release notes...');
  
  try {
    await cdkRelease.createReleaseNotes({
      versionFile: ver.versionFile,
      changelogFile: ver.changelogFile,
      alphaChangelogFile: ver.alphaChangelogFile,
      releaseNotesFile: 'RELEASE_NOTES.md',
    });
    
    console.error('✓ Release notes generated successfully in RELEASE_NOTES.md');
  } catch (error) {
    console.error('❌ Error generating release notes:', error.message);
    throw error;
  }
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});

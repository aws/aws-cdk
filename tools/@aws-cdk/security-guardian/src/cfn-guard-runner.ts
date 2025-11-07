import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

function reverseFilenames(xmlContent: string): string {
  return xmlContent.replace(/<testsuite name="([^"]*_[^"]*)"/g, (match, filename) => {
    const originalName = filename.replace(/_/g, '/');
    return `<testsuite name="${originalName}" file="${originalName}"`;
  });
}

function postProcessXml(outputFile: string): void {
  if (fs.existsSync(outputFile)) {
    const xmlContent = fs.readFileSync(outputFile, 'utf8');
    const correctedXml = reverseFilenames(xmlContent);
    fs.writeFileSync(outputFile, correctedXml);
  }
}

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string
): Promise<boolean> {
  try {
    await exec.exec('sh', [
      '-c',
      `cfn-guard validate --data "${dataDir}" --rules "${ruleSetPath}" --output-format junit --structured --show-summary none > "${outputFile}"`
    ]);
    
    postProcessXml(outputFile);
    
    core.info(`✅ CFN-Guard (${type}) validation passed`);
    return true;
  } catch (err) {
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    
    postProcessXml(outputFile);
    
    return false;
  }
}
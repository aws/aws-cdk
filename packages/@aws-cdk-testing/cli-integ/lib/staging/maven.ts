/* eslint-disable no-console */
import * as path from 'path';
import { LoginInformation } from './codeartifact';
import { parallelShell } from './parallel-shell';
import { UsageDir } from './usage-dir';
import { writeFile } from '../files';
import { shell } from '../shell';

// Do not try to JIT the Maven binary
const NO_JIT = '-XX:+TieredCompilation -XX:TieredStopAtLevel=1';

export async function mavenLogin(login: LoginInformation, usageDir: UsageDir) {
  await writeMavenSettingsFile(settingsFile(usageDir), login);

  // Write env var
  // Twiddle JVM settings a bit to make Maven survive running on a CodeBuild box.
  await usageDir.addToEnv({
    MAVEN_OPTS: `-Duser.home=${usageDir.directory} ${NO_JIT} ${process.env.MAVEN_OPTS ?? ''}`.trim(),
  });
}

function settingsFile(usageDir: UsageDir) {
  // If we configure usageDir as a fake home directory Maven will find this file.
  // (No other way to configure the settings file as part of the environment).
  return path.join(usageDir.directory, '.m2', 'settings.xml');
}

export async function uploadJavaPackages(packages: string[], login: LoginInformation, usageDir: UsageDir) {
  await parallelShell(packages, async (pkg, output) => {
    console.log(`⏳ ${pkg}`);

    await shell(['mvn',
      `--settings=${settingsFile(usageDir)}`,
      'org.apache.maven.plugins:maven-deploy-plugin:3.0.0:deploy-file',
      `-Durl=${login.mavenEndpoint}`,
      '-DrepositoryId=codeartifact',
      `-DpomFile=${pkg}`,
      `-Dfile=${pkg.replace(/.pom$/, '.jar')}`,
      `-Dsources=${pkg.replace(/.pom$/, '-sources.jar')}`,
      `-Djavadoc=${pkg.replace(/.pom$/, '-javadoc.jar')}`], {
      output,
      modEnv: {
        // Do not try to JIT the Maven binary
        MAVEN_OPTS: `${NO_JIT} ${process.env.MAVEN_OPTS ?? ''}`.trim(),
      },
    });

    console.log(`✅ ${pkg}`);
  },
  (pkg, output) => {
    if (output.toString().includes('409 Conflict')) {
      console.log(`❌ ${pkg}: already exists. Skipped.`);
      return 'skip';
    }
    if (output.toString().includes('Too Many Requests')) {
      console.log(`♻️ ${pkg}: Too many requests. Retrying.`);
      return 'retry';
    }
    return 'fail';
  });
}

export async function writeMavenSettingsFile(filename: string, login: LoginInformation) {
  await writeFile(filename, `<?xml version="1.0" encoding="UTF-8" ?>
  <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                                http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <servers>
      <server>
        <id>codeartifact</id>
        <username>aws</username>
        <password>${login.authToken}</password>
      </server>
    </servers>
    <profiles>
      <profile>
        <id>default</id>
        <repositories>
          <repository>
            <id>codeartifact</id>
            <url>${login.mavenEndpoint}</url>
          </repository>
        </repositories>
      </profile>
    </profiles>
    <activeProfiles>
      <activeProfile>default</activeProfile>
    </activeProfiles>
  </settings>`);
}

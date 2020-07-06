const { Octokit } = require('@octokit/rest');
const semver = require('semver');

module.exports.fetchSupplantVersion = async function(base) {

  const baseWithoutPre = base.split('-')[0];

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN must be set');
  }

  const github = new Octokit({ auth: token  });

  const releases = await github.repos.listReleases({
    owner: 'aws',
    repo: 'aws-cdk',
  });

  // this returns a list in decsending order, newest releases first
  for (const release of releases.data) {

    const version = release.name.replace('v', '');

    if (semver.lt(version, baseWithoutPre)) {
      return version;
    }
  }

  return undefined;

}

require('make-runnable/custom')({
  printOutputFrame: false,
})

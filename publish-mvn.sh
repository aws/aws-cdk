#!/bin/bash
set -euo pipefail

###
# Usage: ./publish-mvn.sh <release-zip>
#
# Publishes the content of a release bundle ZIP file to Maven Central. This
# script expects the following environment variables to be set to appropriate
# values (which can be achieved by using scripts/with-signing-key.sh):
# + GNUPGHOME       - A GnuPG home directory containing the signing key
# + KEY_ID          - The ID of the GnuPG key that will be used for signing
# + KEY_PASSWPHRASE - The passphrase of the provided key.
###

if [ $# -ne 1 ]; then
    echo "Missing release zip file argument"
    echo "Usage: ./publish-mvn.sh <release-zip>"
    exit 1
fi

RELEASE_BUNDLE=$1
if [ ! -f ${RELEASE_BUNDLE} ]; then
    echo "${RELEASE_BUNDLE} is not a file!"
    exit 127
fi

###############
# PREPARATION #
###############

declare -a CLEANUP=()
function cleanup() {
    for ((i = 0; i < ${#CLEANUP[@]}; i++ ))
    do
        eval "${CLEANUP[$i]}"
    done
    echo '🍻 Done!'
}
trap cleanup 'EXIT'


WORK_DIR=$(mktemp -d)
CLEANUP+=("echo '🚮 Cleaning up working directory'" "rm -fr ${WORK_DIR}")
echo "💼 Working directory: ${WORK_DIR}"

echo "🗜 Unzipping release bundle (be patient - this may take a while)"
unzip -q ${RELEASE_BUNDLE} -d ${WORK_DIR}

PKG_VERSION=$(cat ${WORK_DIR}/.version)

#######
# MVN #
#######

echo "📦 Publishing to Maven Central"
MVN_SETTINGS=${WORK_DIR}/mvn-settings.xml
CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id cdk/publish/maven --output=text --query=SecretString)
cat > ${MVN_SETTINGS} <<-EOF
<?xml version="1.0" encoding="UTF-8" ?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>maven-central</id>
      <username>$(node -e "console.log(${CREDENTIALS}.username);")</username>
      <password>$(node -e "console.log(${CREDENTIALS}.password);")</password>
    </server>
  </servers>
</settings>
EOF

for pom in $(find ${WORK_DIR}/java/ -name '*.pom'); do
    mvn --settings=${MVN_SETTINGS} gpg:sign-and-deploy-file                     \
        -Durl=https://oss.sonatype.org/service/local/staging/deploy/maven2/     \
        -DrepositoryId=maven-central                                            \
        -Dgpg.homedir=${GNUPGHOME}                                              \
        -Dgpg.keyname=0x${KEY_ID}                                               \
        -Dgpg.passphrase=${KEY_PASSPHRASE}                                      \
        -DpomFile=${pom}                                                        \
        -Dfile=${pom/.pom/.jar}                                                 \
        -Dsources=${pom/.pom/-sources.jar}                                      \
        -Djavadoc=${pom/.pom/-javadoc.jar}
done

echo "⚠️ The packages were published to the STAGING repository. They have to be manually promoted!"
echo "✅ All OK!"

#!/bin/bash
set -euo pipefail

export ROOT=$PWD # So it's available in sub-shells

##############
### SET-UP ###
##############

dir=$(mktemp -d)
cleanup() {
    cd ${ROOT}
    rm -rf ${dir}
}
trap cleanup EXIT

# Now we'll create a hierarchy, so we can test overlay determination is correct:
#
# ${dir}
# ├─ install
# │  ├─ usr             We'll "npm install" y-npm here
# │  └─ y/npm           This is the install-relative repository
# ├─ cwd
# │  ├─ y/npm           This is the $PWD-relative repository
# │  └─ sub             PWD to test the tree crawling of PWD-relative detection
# └─ env
#    └─ repository      This will be the environment-configured repository

install_prefix=${dir}/install/usr
(
    mkdir -p ${install_prefix}
    cd ${install_prefix}
    # Hopping thorugh `npm pack` to avoid `npm`'s local symlinking, that would interfere with install-relative discover
    tarball=$(npm pack --ignore-scripts ${ROOT})
    npm install --global-style --no-save ${tarball}
    ln -s node_modules/.bin bin
)
Y_NPM=${install_prefix}/bin/y-npm

mkdir -p ${dir}/install/y/npm/install-relative
echo '{"name": "install-relative", "versions": { "1.0.0": {} }}' \
    > ${dir}/install/y/npm/install-relative/package.json

mkdir -p ${dir}/cwd/y/npm/cwd-relative
echo '{"name": "cwd-relative", "versions": { "1.0.0": {} }}' \
    > ${dir}/cwd/y/npm/cwd-relative/package.json
mkdir -p ${dir}/cwd/sub

mkdir -p ${dir}/env/repository/env
echo '{"name": "env", "versions": { "1.0.0": {} }}' \
    > ${dir}/env/repository/env/package.json

unset Y_NPM_REPOSITORY # in case the environment had it

##################
### TEST CASES ###
##################
exit_code=0
export Y_NPM_NO_COLOR=1 # Disable colored output

(
    title="Correctly uses install-relative repository: "
    cd ${dir}
    expected="install-relative@1.0.0"
    actual=$(${Y_NPM} y-ls)
    if [ ${expected} == ${actual} ]; then
        echo "✅ ${title}"
    else
        echo "❌ ${title}"
        echo "├─ Expected: ${expected}"
        echo "└─ Actual:   ${actual}"
        exit_code=1
    fi
)

(
    title="Correctly uses \$PWD-relative repository (current directory)"
    cd ${dir}/cwd
    expected="cwd-relative@1.0.0"
    actual=$(${Y_NPM} y-ls)
    if [ ${expected} == ${actual} ]; then
        echo "✅ ${title}"
    else
        echo "❌ ${title}"
        echo "├─ Expected: ${expected}"
        echo "└─ Actual:   ${actual}"
        exit_code=1
    fi
)

(
    title="Correctly uses \$PWD-relative repository (parent directory)"
    cd ${dir}/cwd/sub
    expected="cwd-relative@1.0.0"
    actual=$(${Y_NPM} y-ls)
    if [ ${expected} == ${actual} ]; then
        echo "✅ ${title}"
    else
        echo "❌ ${title}"
        echo "├─ Expected: ${expected}"
        echo "└─ Actual:   ${actual}"
        exit_code=1
    fi
)

(
    title="Correctly uses environment-configured repository"
    cd ${dir}
    expected="env@1.0.0"
    actual=$(Y_NPM_REPOSITORY=${dir}/env/repository ${Y_NPM} y-ls)
    if [ ${expected} == ${actual} ]; then
        echo "✅ ${title}"
    else
        echo "❌ ${title}"
        echo "├─ Expected: ${expected}"
        echo "└─ Actual:   ${actual}"
        exit_code=1
    fi
)

(
    title="Correctly adds published packages to overlay"
    cd ${dir}
    version=$(node -e "console.log(require('${ROOT}/package.json').version);")
    NL=$'\n'
    expected="install-relative@1.0.0${NL}y-npm@${version}"
    ${Y_NPM} publish ${install_prefix}/y-npm-*.tgz
    actual=$(${Y_NPM} y-ls)
    if [ "${expected}" == "${actual}" ]; then
        echo "✅ ${title}"
    else
        echo "❌ ${title}"
        echo "├─ Expected: ${expected}"
        echo "└─ Actual:   ${actual}"
        exit_code=1
    fi
)

exit ${exit_code}

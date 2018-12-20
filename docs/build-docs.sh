#!/bin/bash
set -euo pipefail

PYTHON_DEPS="$PWD/python-deps"

#----------------------------------------------------------------------
# Install python depednencies to a local tree
if [ ! -d ${PYTHON_DEPS} ]; then
    mkdir -p "${PYTHON_DEPS}"
    pip install --ignore-installed --install-option="--prefix=${PYTHON_DEPS}" -r requirements.txt
fi

# Overwrite any templates in
#   ${PYTHON_DEPS}/lib/python2.7/site-packages/sphinx_rtd_theme
#   ${PYTHON_DEPS}/lib/python3.6/site-packages/sphinx_rtd_theme
#   ${PYTHON_DEPS}/lib/python3.7/site-packages/sphinx_rtd_theme
# with those in
#   _templates
if [ -d ${PYTHON_DEPS}/lib/python2.7/site-packages/sphinx_rtd_theme ]; then
    cp _templates/* ${PYTHON_DEPS}/lib/python2.7/site-packages/sphinx_rtd_theme
fi

if [ -d ${PYTHON_DEPS}/lib/python3.6/site-packages/sphinx_rtd_theme ]; then
    cp _templates/* ${PYTHON_DEPS}/lib/python3.6/site-packages/sphinx_rtd_theme
fi

if [ -d ${PYTHON_DEPS}/lib/python3.7/site-packages/sphinx_rtd_theme ]; then
    cp _templates/* ${PYTHON_DEPS}/lib/python3.7/site-packages/sphinx_rtd_theme
fi

export PYTHONPATH=${PYTHON_DEPS}/lib/python2.7/site-packages:${PYTHON_DEPS}/lib/python3.6/site-packages:${PYTHON_DEPS}/lib/python3.7/site-packages
export PATH=${PYTHON_DEPS}/bin:$PATH

#----------------------------------------------------------------------
# CONFIG
staging=".staging"
output="dist"
refsrc="../dist/sphinx"
refdocs="refs"
refdocsdir="${staging}/${refdocs}"
refs_index="${staging}/reference.rst"

#----------------------------------------------------------------------
# PREREQ CHECK

if ! which sphinx-build > /dev/null; then
    echo "'sphinx-build' not found. Please 'pip install sphinx'.">&2
    exit 1
fi

#----------------------------------------------------------------------
# DO THE WORK

echo "Staging Sphinx doc site under ${staging}"
mkdir -p ${staging}
rsync -av src/ ${staging}

echo "Copying generated reference documentation..."
rm -fr ${refdocsdir}/
mkdir -p ${refdocsdir}

if [ -z "${BUILD_DOCS_DEV:-}" ]; then
    if [ ! -d "${refsrc}" ]; then
        echo "Cannot find ${refsrc} in the root directory of this repo"
        echo "Did you run ./pack.sh?"

        if [ -z "${BUILD_DOCS_DEV:-}" ]; then
            echo "Cannot build docs without reference. Set BUILD_DOCS_DEV=1 to allow this for development purposes"
            exit 1
        fi
    else
        rsync -av ${refsrc}/ ${refdocsdir}/

        echo "Generating reference docs toctree under ${refs_index}..."
        cat ${refs_index}.template > ${refs_index}
        ls -1 ${refdocsdir} | grep '.rst$' | sed -e 's/\.rst//' | sort | xargs -I{} echo "   ${refdocs}/{}" >> ${refs_index}
    fi
else
    echo "BUILD_DOCS_DEV is set, continuing without reference documentation..."
fi

export CDK_VERSION=$(../tools/pkgtools/bin/cdk-version)
echo "Set CDK_VERSION=${CDK_VERSION} (consumed by conf.py)..."

sphinx-build -b html $staging $output

# required for github pages since we have already rendered the site ourselves
echo "disable-jekyll" > $output/.nojekyll


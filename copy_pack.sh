distdir="$PWD/dist"

for dir in $(find packages -name dist | grep -v node_modules | grep -v run-wrappers); do
  echo "Merging ${dir} into ${distdir}" >&2
  rsync -a $dir/ ${distdir}/
done
Public suffix list obtained from https://publicsuffix.org/.

We build a lookup map that for 90% of the cases can return the probable intended apex domain.

We're ignoring Punycode on purpose.

Whenever you pull a new version of the .dat file, don't forget to run build-map.py.
Not integrated as part of the build because this file will change only very rarely.

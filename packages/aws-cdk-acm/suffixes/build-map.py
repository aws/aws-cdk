#!/usr/bin/env python2.7
"""Script to build a lookup map from the lines in the public suffix data list.

See README.txt in this directory for more info.
"""
import re
import json

trie = {}

with file('public_suffix_list.dat') as f:
  for line in f:
    line = line.strip()

    # All reasons to skip this line
    if not line: continue
    if line.startswith('//'): continue
    if re.search('[^a-z0-9.]', line): continue

    # *. at the start is the same as it not being there
    if line.startswith('*.'): line = line[2:]

    # Add to the trie
    parts = line.split('.')
    parts.reverse()

    curr = trie
    for part in parts:
      curr = curr.setdefault(part, {})


with file('../lib/public-suffixes.ts', 'w') as o:
  o.write('// This file has been generated using ../suffixes/build-map.py\n')
  o.write('// tslint:disable:no-trailing-whitespace object-literal-key-quotes\n')
  o.write('export = %s;' % json.dumps(trie, indent=2))

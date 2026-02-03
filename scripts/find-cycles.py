#!/usr/bin/env python
import json
import sys
import collections
import pprint

def find(xs, x):
  for i, value in enumerate(xs):
    if x == value:
      return i
  return None

filenames = sys.argv[1:]

graph = collections.defaultdict(set)
for filename in filenames:
  with open(filename) as f:
    package_json = json.load(f)

  for key in ['devDependencies', 'dependencies']:
    if key in package_json:
      graph[package_json['name']].update(package_json[key].keys())


checked = set()

# Do a check for cycles for each package. This is slow but it works,
# and it has the advantage that it can give good diagnostics.
def check_for_cycles(package, path):
  i = find(path, package)
  if i is not None:
    cycle = path[i:] + [package]
    print('Cycle: %s' % ' => '.join(cycle))
    return

  if package in checked:
    return

  checked.add(package)

  deps = graph.get(package, [])
  for dep in deps:
    check_for_cycles(dep, path + [package])

for package in graph.keys():
  check_for_cycles(package, [])

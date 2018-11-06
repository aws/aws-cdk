#!/usr/bin/env python3
import json
import sys
import collections
import os
from os import path


def full_dependency_graph():
  """Return a map of { package -> [package] }."""
  graph = collections.defaultdict(set)
  for filename in package_jsons():
    with open(filename) as f:
      package_json = json.load(f)

    for key in ['devDependencies', 'dependencies']:
      if key in package_json:
        graph[package_json['name']].update(package_json[key].keys())

  return graph


def local_dependency_graph():
  """Retain only the dependencies that are also in the repo."""
  graph = full_dependency_graph()
  for deps in graph.values():
    deps.intersection_update(graph.keys())
  return graph


def package_jsons():
  """Return a list of all package.json files in this project."""
  rootdir = path.dirname(path.dirname(path.realpath(__file__)))
  for root, dirs, files in os.walk(rootdir):
    if 'node_modules' in dirs:
      dirs.remove('node_modules')

    if 'package.json' in files:
      yield path.join(root, 'package.json')


def find(xs, x):
  for i, value in enumerate(xs):
    if x == value:
      return i
  return None


def print_graph(graph):
  for package, deps in graph.items():
    for dep in deps:
      print('%s -> %s' % (package, dep))

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

def main():
  print_graph(local_dependency_graph())


if __name__ == '__main__':
  main()

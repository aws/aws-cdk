#!/usr/bin/env python3
"""Analyze and visualize package dependencies in the AWS CDK monorepo.

This script scans all package.json files in the repository, builds a dependency
graph, and detects circular dependencies between packages.
"""
import json
import sys
import collections
import os
from os import path
from typing import Dict, Set, List, Iterator, Optional


def full_dependency_graph() -> Dict[str, Set[str]]:
  """Return a map of { package -> [package] } including all dependencies."""
  graph: Dict[str, Set[str]] = collections.defaultdict(set)
  for filename in package_jsons():
    try:
      with open(filename, encoding='utf-8') as f:
        package_json = json.load(f)
    except (json.JSONDecodeError, IOError) as e:
      print(f"Warning: Failed to read {filename}: {e}", file=sys.stderr)
      continue

    package_name = package_json.get('name')
    if not package_name:
      continue

    for key in ['devDependencies', 'dependencies']:
      if key in package_json:
        graph[package_name].update(package_json[key].keys())

  return graph


def local_dependency_graph() -> Dict[str, Set[str]]:
  """Retain only the dependencies that are also in the repo."""
  graph = full_dependency_graph()
  for deps in graph.values():
    deps.intersection_update(graph.keys())
  return graph


def package_jsons() -> Iterator[str]:
  """Return a list of all package.json files in this project."""
  rootdir = path.dirname(path.dirname(path.realpath(__file__)))
  for root, dirs, files in os.walk(rootdir):
    if 'node_modules' in dirs:
      dirs.remove('node_modules')

    if 'package.json' in files:
      yield path.join(root, 'package.json')


def find(xs: List[str], x: str) -> Optional[int]:
  """Find the index of element x in list xs, return None if not found."""
  for i, value in enumerate(xs):
    if x == value:
      return i
  return None


def print_graph(graph: Dict[str, Set[str]]) -> None:
  """Print the dependency graph and detect cycles."""
  for package, deps in graph.items():
    for dep in deps:
      print('%s -> %s' % (package, dep))

  checked: Set[str] = set()

  # Do a check for cycles for each package. This is slow but it works,
  # and it has the advantage that it can give good diagnostics.
  def check_for_cycles(package: str, path: List[str]) -> None:
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


def main() -> None:
  """Main entry point."""
  print_graph(local_dependency_graph())


if __name__ == '__main__':
  main()

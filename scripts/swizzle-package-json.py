#!/usr/bin/env python3
import argparse
import collections
import copy
import subprocess
import json
import os
from os import path


def main():
  parser = argparse.ArgumentParser(description='Mass-update package.json to local package references')
  parser.add_argument('command', type=str, choices=['links', 'restore', 'hide'], help='How to represent intra-repo references')

  args = parser.parse_args()

  package_list = find_lerna_list()

  # Index by name
  packages = {p['name']: p for p in package_list}


  for dirpath, dirnames, filenames in os.walk('.'):
    remove_inplace(dirnames, ['node_modules'])

    package_json_path = path.join(dirpath, 'package.json')
    if path.exists(package_json_path):
      update_package_json(package_json_path, packages, args.command)


def update_package_json(package_json_path, packages, command):
  with open(package_json_path, 'r') as f:
    # Retain order in JSON KVs
    package_json = json.load(f, object_pairs_hook=collections.OrderedDict)

  update_dependencies(package_json, 'dependencies', packages, command)
  update_dependencies(package_json, 'devDependencies', packages, command)

  with open(package_json_path, 'w') as f:
    json.dump(package_json, f, indent=2)
    f.write('\n') # Terminate with newline as NPM tools do


def update_dependencies(package_json, dependency_key, local_packages, command):
  backup_key = 'BACKUP_' + dependency_key

  if command in ['links', 'hide']:
    # Save a backup
    if backup_key not in package_json:
      package_json[backup_key] = copy.copy(package_json.get(dependency_key))

    deps = package_json.get(dependency_key, {})
    for key in list(deps.keys()):
      local_package = local_packages.get(key)

      if local_package:
        if command == 'links':
          deps[key] = 'file:' + local_package['location']
        elif command =='hide':
          del deps[key]

    package_json[dependency_key] = deps
  else:
    # Restore backup
    backup = package_json.get(backup_key)
    if backup is not None:
      package_json[dependency_key] = backup
    else:
      unset(package_json, dependency_key)
    unset(package_json, backup_key)


def unset(dict, key):
  if key in dict:
    del dict[key]


def remove_inplace(xs, to_remove):
  xs[:] = [x for x in xs if x not in to_remove]


def find_lerna_list():
  cwd = os.getcwd()

  while not path.exists(path.join(cwd, 'lerna.json')):
    next = path.dirname(cwd)
    if next == cwd:
      raise RuntimeError('Run this script from somewhere underneath lerna.json!')
    cwd = next

  return json.loads(subprocess.check_output(['npx', 'lerna', 'ls', '--all', '--json'], shell=False, cwd=cwd).decode('utf-8'))


if __name__ == '__main__':
  main()

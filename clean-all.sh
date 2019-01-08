#!/bin/bash
# Cleans workspace, allowing almost fresh builds. 
# May require admin rights (if global linking has been done)

lerna exec 'rm -f lib/*generated*'
lerna exec 'rm -rf node_modules'
rm -rf node_modules
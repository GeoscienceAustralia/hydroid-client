#!/bin/bash
./node_modules/.bin/grunt build
cp appspec.yml build/webapp/
mkdir release
cd build/webapp/
zip -r ../../release/hydroid.zip *

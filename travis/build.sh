#!/bin/bash
npm install angular-material
npm install -g grunt-cli
grunt build
cd ../
mkdir release
cd build/webapp/
zip -r ../../release/hydroid.zip *

#!/bin/bash
npm install
bower install
grunt build
mkdir release
cd build/webapp/
zip -r ../../release/hydroid.zip *

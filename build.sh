#!/bin/bash
grunt build
mkdir release
cd build/webapp/
zip -r ../../release/hydroid.zip *

#!/bin/bash

for file in ./src/*.ts; do
        f="$(basename -- $file)"
        filename=${f%%.*}
        node_modules/.bin/babel ./src/$filename.ts -o ./lib/$filename.js
done
#!/bin/bash

rm -rf example/public
rm -rf example/files
mkdir -p example/files

for i in {1..100}; do
    echo $i
    echo "$i" > "example/files/$(echo $i).txt"
done

for i in {1..100}; do
    echo $i
    echo "$i" > "example/files/$(echo $i).html"
done

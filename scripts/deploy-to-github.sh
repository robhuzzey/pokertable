#!/bin/bash
git add .
git commit -m "deploy commit"
git push origin HEAD
git push origin `git subtree split --prefix dist staging`:master --force
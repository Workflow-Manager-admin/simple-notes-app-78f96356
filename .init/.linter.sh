#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-notes-app-78f96356/frontend_qwik
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi


#!/bin/bash
git pull --rebase origin main && npm run install && npm run build && npm run production

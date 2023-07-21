#!/bin/bash
npm run install && npm run build && sudo cp -r ~/client/build /var/www && sudo systemctl restart nginx && npm run production

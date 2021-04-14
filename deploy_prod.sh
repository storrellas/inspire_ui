read -n 1 -r -s -p $'You are about to deploy to prod. Press any key to continue\n'
scp -r build/asset-manifest.json build/favicon.ico build/index.html build/logo192.png build/logo512.png build/logo.png build/manifest.json build/robots.txt build/static inspire_pro:/home/storrellas/workspace/inspire_ui/

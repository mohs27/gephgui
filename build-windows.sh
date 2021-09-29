#!/bin/bash

wget https://ipfs.io/ipfs/QmR8dQpon36ACS3dqsKUQLQv2vng93SnqzX18uvksKEEEe
unzip QmR8dQpon36ACS3dqsKUQLQv2vng93SnqzX18uvksKEEEe
export VERSION=$(cat package.json | jq -r ".version")
echo "Windows 32-bit!"
npm run electron:windows
wine ISCC.exe inno/setup.iss
mv inno/Output/geph-windows-setup.exe dist/geph-windows-$VERSION-setup.exe
wget mv inno/Output/geph-windows-setup.exe dist/geph-windows-$VERSION-setup.exe
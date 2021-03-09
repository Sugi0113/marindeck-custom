//エラー発生でalertした時に表示される発生箇所の文字数からエラー箇所を特定するために、1行にしたファイルを作成する
const fs = require('fs');
fs.writeFileSync('1line.js' ,fs.readFileSync('custom.js', 'UTF-8').replace(/(\n|\r|\r\n)/g, ' '));
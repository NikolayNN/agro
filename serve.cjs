// Локальный предпросмотр. По умолчанию доступен только на этом компьютере.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.png':'image/png'};
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  const file = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  const relative = path.relative(root,file);
  if(relative.startsWith('..') || path.isAbsolute(relative) || !mime[path.extname(file)]) { res.writeHead(404); return res.end(); }
  fs.readFile(file,(err,data) => { if(err){res.writeHead(404);return res.end();} res.setHeader('Content-Type',mime[path.extname(file)]);res.setHeader('Cache-Control','no-cache');res.end(data); });
}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));

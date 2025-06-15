const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const filesDir = path.join(__dirname, 'files');

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  const filename = query.name;
  const filepath = path.join(filesDir, filename || '');

  res.setHeader('Content-Type', 'text/plain');

  if (pathname === '/create' && req.method === 'GET') {
    const content = query.content || '';
    if (!filename) return res.end('Filename is required.');

    fs.writeFile(filepath, content, (err) => {
      if (err) return res.end('Error creating file.');
      res.end(`File '${filename}' created successfully.`);
    });

  } else if (pathname === '/read' && req.method === 'GET') {
    if (!filename) return res.end('Filename is required.');

    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) return res.end('Error reading file.');
      res.end(data);
    });

  } else if (pathname === '/delete' && req.method === 'GET') {
    if (!filename) return res.end('Filename is required.');

    fs.unlink(filepath, (err) => {
      if (err) return res.end('Error deleting file.');
      res.end(`File '${filename}' deleted successfully.`);
    });

  } else {
    res.statusCode = 404;
    res.end('Invalid route. Use /create, /read, or /delete.');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

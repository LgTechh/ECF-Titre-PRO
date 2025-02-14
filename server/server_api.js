const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const PORT = config.API_PORT;

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '../public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.jpeg': contentType = 'image/jpeg'; break;
        case '.webp': contentType = 'image/webp'; break;
        case '.json': contentType = 'application/json'; break;
    }

    if (req.url === '/data/events.json') {
        const dataFilePath = path.join(__dirname, '../data/events.json');
        fs.readFile(dataFilePath, (err, content) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Not Found');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(content, 'utf8');
            }
        });
    } else {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(path.join(__dirname, '../public', '404.html'), (err404, content404) => {
                        if (err404) {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end('500 Internal Server Error');
                        } else {
                            res.writeHead(404, {'Content-Type': 'text/html'});
                            res.end(content404, 'utf8');
                        }
                    });
                } else {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('500 Internal Server Error');
                }
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content, 'utf8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
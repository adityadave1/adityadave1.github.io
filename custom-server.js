const { createServer } = require('http');

createServer((req, res) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
    }
    // ... rest of your server logic
}).listen(8080);
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9734;

const SOURCES_PATH = path.resolve(__dirname, '../src');

const requestHandler = (request, response) => {
    const filePathes = fs.readdirSync(SOURCES_PATH);
    
    const files = filePathes.map(filename => ({
        filename, 
        content: fs.readFileSync(path.resolve(SOURCES_PATH, filename))
    }));

    response.end(`
<html>
    <head>
        <title>JetBrians Icons demo list</title>
    </head>
    <body>
        <table>
            ${files.map(f => `
                <tr>
                    <td>${f.content}</td>
                    <td><pre>${f.filename}</pre></td>
                </tr>
            `).join('')}
        </table>
    </body>
</html>
    `);
}
const server = http.createServer(requestHandler)
server.listen(PORT, err => {
    if (err) {
        return console.error('something bad happened', err);
    }
    console.log(`server is listening on http://localhost:${PORT}`);
})
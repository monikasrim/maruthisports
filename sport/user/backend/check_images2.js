const fs = require('fs');
const https = require('https');

const products = JSON.parse(fs.readFileSync('products_utf8.json', 'utf8'));
let results = [];
let pending = products.length;

products.forEach(p => {
    if (p.image.startsWith('https')) {
        https.get(p.image, (res) => {
            results.push(`${res.statusCode} - ${p.name}`);
            done();
        }).on('error', (e) => {
            results.push(`Error - ${p.name}: ${e.message}`);
            done();
        });
    } else {
        results.push(`Local/Invalid - ${p.name}: ${p.image}`);
        done();
    }
});

function done() {
    pending--;
    if (pending === 0) {
        fs.writeFileSync('image_status.txt', results.join('\n'));
        console.log("Done");
    }
}

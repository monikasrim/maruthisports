const fs = require('fs');
const https = require('https');

const products = JSON.parse(fs.readFileSync('products_utf8.json', 'utf8'));

products.forEach(p => {
    if (p.image.startsWith('https')) {
        https.get(p.image, (res) => {
            console.log(`${res.statusCode} - ${p.name}`);
        }).on('error', (e) => {
            console.error(`Error for ${p.name}: ${e.message}`);
        });
    }
});

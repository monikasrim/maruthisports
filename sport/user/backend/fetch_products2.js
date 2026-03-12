const fs = require('fs');
fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
        fs.writeFileSync('products_utf8.json', JSON.stringify(data.slice(0, 10).map(p => ({ name: p.name, image: p.image })), null, 2));
    });

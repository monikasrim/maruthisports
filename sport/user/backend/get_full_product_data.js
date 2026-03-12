const fs = require('fs');
fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
        fs.writeFileSync('full_products.json', JSON.stringify(data, null, 2));
        console.log("Saved to full_products.json");
    })
    .catch(err => console.error(err));

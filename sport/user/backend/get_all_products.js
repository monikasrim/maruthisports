const fs = require('fs');
fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
        fs.writeFileSync('all_products.json', JSON.stringify(data.map(p => ({
            id: p._id,
            name: p.name,
            category: p.category,
            image: p.image
        })), null, 2));
        console.log("Saved to all_products.json");
    })
    .catch(err => console.error(err));

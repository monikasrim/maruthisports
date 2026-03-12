fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
        data.forEach(p => {
            console.log(`${p.name}: ${p.countInStock > 0 ? 'In Stock (' + p.countInStock + ')' : 'Out of Stock'}`);
        });
    })
    .catch(err => console.error(err));

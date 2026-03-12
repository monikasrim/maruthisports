fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
        console.log(JSON.stringify(data.slice(0, 10).map(p => ({
            name: p.name,
            image: p.image
        })), null, 2));
    })
    .catch(err => console.error(err));

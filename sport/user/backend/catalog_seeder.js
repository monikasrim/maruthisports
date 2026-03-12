const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const reviewerNames = [
    "Arjun Sharma", "Priya Krishnan", "Rahul Mehra", "Deepa Reddy", "Vijay Thapa",
    "Anitha Lakshmi", "Suresh Babu", "Meera Janardhan", "Karthik Prabhu", "Sneha Verma",
    "Vivek Gupta", "Lakshmi Narayan", "Rohan Das", "Swati Patil", "Manish Nair"
];

const comments = [
    "Outstanding quality, very durable even after heavy use.",
    "Best budget gear I have found for my daily practice sessions.",
    "Perfect fit and extremely comfortable during the game.",
    "Great value for money, I highly recommend Maruthi Sports.",
    "The build quality is superior to many expensive brands.",
    "Maruthi Sports equipment is professional grade and very reliable.",
    "Excellent performance on the field, very happy with this purchase.",
    "Sturdy construction and professional finish. A must-buy!",
    "Highly satisfied with the grip and overall feel of the product.",
    "Superior finish and very durable. Great addition to my sports kit.",
    "Fantastic product! The quality exceeded my expectations for this price.",
    "Really impressed with the durability. Maruthi Sports is the best.",
    "Top-notch performance. This has definitely improved my game.",
    "Very comfortable to use and looks premium too.",
    "Amazing value! Sturdy, reliable, and looks great."
];

const brandsMap = {
    "Cricket Products": ["MRF", "SG", "SS", "Kookaburra", "Gray-Nicolls", "GM", "Spartan", "BAS"],
    "Football / Soccer Products": ["Nike", "Adidas", "Puma", "Nivia", "Cosco"],
    "Badminton Products": ["Yonex", "Li-Ning", "Victor", "Cosco", "Carlton"],
    "Volleyball Products": ["Mikasa", "Nivia", "Cosco"],
    "Basketball Products": ["Spalding", "Wilson", "Nike", "Adidas"],
    "Fitness & Gym Products": ["Kore", "Aurion", "AmazonBasics", "Cosco"],
    "Indoor Games": ["Synco", "Precise", "Stag", "GSI"],
    "Sports Clothing": ["Nike", "Adidas", "Puma", "Reebok", "Decathlon"],
    "Running & Training Accessories": ["Nike", "Adidas", "Puma", "Skechers"],
    "Other Accessories": ["Maruthi", "Vanguard", "Guardian"]
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const products = [
    // 1. Cricket Products
    { name: "Cricket Bat", category: "Cricket Products", price: 999, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop", description: "Premium willow bat designed for high performance and durability." },
    { name: "Cricket Ball (Leather / Tennis)", category: "Cricket Products", price: 199, image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2074&auto=format&fit=crop", description: "Standard weight and bounce, suitable for all types of cricket matches." },
    { name: "Batting Gloves", category: "Cricket Products", price: 499, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "High-grade leather palms for superior grip and finger protection." },
    { name: "Wicket Keeping Gloves", category: "Cricket Products", price: 699, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Padded palms and reinforced fingers for professional wicket-keeping." },
    { name: "Cricket Pads", category: "Cricket Products", price: 1299, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Lightweight and high-impact resistance for maximum leg protection." },
    { name: "Cricket Helmet", category: "Cricket Products", price: 1499, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Adjustable steel grill with high-impact ABS shell for head safety." },
    { name: "Thigh Guard", category: "Cricket Products", price: 249, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Ergonomic design for comfortable thigh protection during batting." },
    { name: "Arm Guard", category: "Cricket Products", price: 199, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Elasticated fit providing solid protection to the forearm." },
    { name: "Cricket Stumps", category: "Cricket Products", price: 599, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "High-quality wooden stumps set with bails for match play." },
    { name: "Cricket Kit Bag", category: "Cricket Products", price: 899, image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Large capacity bag to hold all your cricket equipment safely." },

    // 2. Football / Soccer Products
    { name: "Football", category: "Football / Soccer Products", price: 499, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop", description: "Standard size 5 football with high air retention and soft touch." },
    { name: "Football Shoes / Studs", category: "Football / Soccer Products", price: 1299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", description: "Lightweight studs for excellent traction on natural grass fields." },
    { name: "Shin Guards", category: "Football / Soccer Products", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "High-impact plastic shell with foam backing for leg safety." },
    { name: "Goalkeeper Gloves", category: "Football / Soccer Products", price: 399, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Premium latex palms for superior grip and ball handling." },
    { name: "Football Net", category: "Football / Soccer Products", price: 999, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Durable nylon net for full-sized football goal posts." },
    { name: "Training Cones", category: "Football / Soccer Products", price: 299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Bright colored cones for agility and speed training drills." },

    // 3. Badminton Products
    { name: "Badminton Racket", category: "Badminton Products", price: 499, image: "https://images.unsplash.com/photo-1610970881699-44a5587cab28?q=80&w=800&auto=format&fit=crop", description: "Lightweight graphite racket for fast swings and power shots." },
    { name: "Shuttlecock (Feather / Plastic)", category: "Badminton Products", price: 299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Precision balanced shuttlecocks for professional flight trajectory." },
    { name: "Badminton Net", category: "Badminton Products", price: 599, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "High-quality nylon badminton net for indoor and outdoor play." },
    { name: "Racket Grip", category: "Badminton Products", price: 99, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Anti-slip replacement grip for enhanced racket control." },
    { name: "Racket Cover", category: "Badminton Products", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Protective padded cover to keep your rackets safe." },

    // 4. Volleyball Products
    { name: "Volleyball", category: "Volleyball Products", price: 399, image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2070&auto=format&fit=crop", description: "Soft-touch volleyball for better control and impact absorption." },
    { name: "Volleyball Net", category: "Volleyball Products", price: 799, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Standard competition grade volleyball net." },
    { name: "Knee Pads", category: "Volleyball Products", price: 299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Elastic knee pads for superior impact protection on court." },

    // 5. Basketball Products
    { name: "Basketball", category: "Basketball Products", price: 499, image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2142&auto=format&fit=crop", description: "Official size and weight basketball with advanced grip texture." },
    { name: "Basketball Net", category: "Basketball Products", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Heavy-duty nylon basketball net for all weather conditions." },
    { name: "Basketball Hoop", category: "Basketball Products", price: 1999, image: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=2070&auto=format&fit=crop", description: "Durable steel rim hoop for professional practice." },
    { name: "Basketball Shoes", category: "Basketball Products", price: 1599, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", description: "High-top shoes providing excellent ankle support and cushioning." },

    // 6. Fitness & Gym Products
    { name: "Dumbbells", category: "Fitness & Gym Products", price: 599, image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070&auto=format&fit=crop", description: "Pair of dumbbells for strength training and muscle building." },
    { name: "Barbell Rod", category: "Fitness & Gym Products", price: 1299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Solid steel barbell rod for heavy weightlifting." },
    { name: "Weight Plates", category: "Fitness & Gym Products", price: 1899, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Rubber coated weight plates for floor protection and durability." },
    { name: "Resistance Bands", category: "Fitness & Gym Products", price: 399, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Versatile bands for full-body resistance training." },
    { name: "Skipping Rope", category: "Fitness & Gym Products", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Adjustable speed skipping rope for cardio workouts." },
    { name: "Yoga Mat", category: "Fitness & Gym Products", price: 499, image: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Eco-friendly non-slip yoga mat for floor exercises." },
    { name: "Foam Roller", category: "Fitness & Gym Products", price: 499, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Muscle recovery foam roller for self-massage." },
    { name: "Hand Grip Strengthener", category: "Fitness & Gym Products", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Adjustable grip strengthener for hand and forearm power." },

    // 7. Indoor Games
    { name: "Carrom Board", category: "Indoor Games", price: 1599, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Standard sized carrom board with smooth surface finish." },
    { name: "Carrom Coins Set", category: "Indoor Games", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Complete set of carrom coins including queen." },
    { name: "Carrom Striker", category: "Indoor Games", price: 99, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Championship grade striker for precise shots." },
    { name: "Chess Board", category: "Indoor Games", price: 299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Folding chess board with high-quality pieces." },
    { name: "Table Tennis Bat", category: "Indoor Games", price: 349, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Advanced table tennis bat for better spin and control." },
    { name: "Table Tennis Ball", category: "Indoor Games", price: 99, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Pack of 6 seamless table tennis balls." },
    { name: "Table Tennis Net", category: "Indoor Games", price: 399, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Easy-to-mount table tennis net for any standard table." },

    // 8. Running & Training Accessories
    { name: "Sports Shoes", category: "Running & Training Accessories", price: 999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", description: "Breathable and cushioned shoes for running and daily training." },
    { name: "Water Bottles", category: "Running & Training Accessories", price: 99, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "BPA-free plastic water bottle for sports hydration." },
    { name: "Sweat Bands", category: "Running & Training Accessories", price: 49, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Cotton sweat bands for wrists to keep grips dry." },
    { name: "Sports Towel", category: "Running & Training Accessories", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Quick-dry microfiber towel for sports and gym." },
    { name: "Stop Watch", category: "Running & Training Accessories", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Accurate digital stopwatch for timing your laps." },
    { name: "Whistle", category: "Running & Training Accessories", price: 49, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Standard high-pitch whistle for sports coaching." },

    // 9. Sports Clothing
    { name: "Sports T-Shirts", category: "Sports Clothing", price: 299, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Moisture-wicking fabric for comfort during intense sports." },
    { name: "Shorts", category: "Sports Clothing", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Lightweight polyester shorts for agility and breathability." },
    { name: "Track Pants", category: "Sports Clothing", price: 499, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Comfortable track pants for warm-ups and training." },
    { name: "Jerseys", category: "Sports Clothing", price: 349, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Team jerseys with breathable mesh panels." },
    { name: "Socks", category: "Sports Clothing", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Cushioned sports socks for blister-free performance." },
    { name: "Caps", category: "Sports Clothing", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Adjustable sports cap for outdoor training." },

    // 10. Other Accessories
    { name: "Sports Bags / Kit Bags", category: "Other Accessories", price: 499, image: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Durable kit bag to organize your sports essentials." },
    { name: "First Aid Kit", category: "Other Accessories", price: 399, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Essential first aid items for sports related injuries." },
    { name: "Ice Pack", category: "Other Accessories", price: 99, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Instant cold pack for immediate pain relief and recovery." },
    { name: "Knee Support", category: "Other Accessories", price: 199, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Elastic knee brace for stability and injury prevention." },
    { name: "Elbow Support", category: "Other Accessories", price: 149, image: "https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", description: "Compression elbow sleeve for joint protection." }
];

const seedCatalog = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const admin = await User.findOne({ isAdmin: true }) || await User.findOne();

        await Product.deleteMany({});
        console.log('Cleared existing products.');

        let revIndex = 0;
        let commentIndex = 0;

        for (const item of products) {
            const productReviews = [];
            // Generate 3 unique reviews per product
            for (let i = 0; i < 3; i++) {
                productReviews.push({
                    name: reviewerNames[revIndex % reviewerNames.length],
                    rating: 5,
                    comment: comments[commentIndex % comments.length],
                    user: admin._id
                });
                revIndex++;
                commentIndex++;
            }

            const product = new Product({
                ...item,
                brand: getRandom(brandsMap[item.category] || ["Maruthi"]),
                user: admin._id,
                rating: 5,
                numReviews: productReviews.length,
                countInStock: 50,
                reviews: productReviews
            });
            await product.save();
            console.log(`Seeded: ${product.name} | Brand: ${product.brand} | Cat: ${product.category}`);
        }

        console.log(`Catalog update complete! Seeded ${products.length} products with specific brands.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedCatalog();

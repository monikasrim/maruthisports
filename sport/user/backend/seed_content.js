const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed content...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const detailedDescriptions = {
    "Basketball Hoop": "Engineered for elite performance, the Sky-High Pro Hoop features a heavy-duty breakaway rim and a crystal-clear, shatterproof polycarbonate backboard. The pro-style spring action ensures a consistent bounce and safe dunks, while the weather-resistant plating makes it perfect for both intense indoor training and outdoor play. Includes a high-density base that can be filled with sand or water for ultimate stability during aggressive plays.",
    "Kettlebell": "Take your strength training to the next level with our Cast Iron Kettlebells. Machined from a single solid piece of high-grade cast iron, these kettlebells are built to last a lifetime. The wide, ergonomic handle provides a secure grip for both single and double-handed exercises, while the flat base ensures stability during floor-based movements. Powder-coated finish resists chipping and provides a premium feel during snatches, swings, and presses.",
    "Tennis Balls": "Experience professional-grade performance with Vortex Pro-Court Tennis Balls. These pressurized balls are crafted with premium wool felt and a specialized rubber core to deliver consistent bounce and exceptional visibility. Designed for all surface types, they maintain their pressure longer than standard balls, making them the choice of competitive athletes. Comes in a vacuum-sealed can of 3 to ensure peak freshness and performance.",
    "Basketball": "The Zenith Grip Basketball is designed for players who demand precision and control. Featuring a soft-touch composite cover with advanced moisture-wicking technology, it provides an unbeatable grip even during the most intense games. The wide channel design improves shooting mechanics and ball handling, while the high-performance butyl bladder ensures superior air retention and a perfectly balanced bounce on any court surface.",
    "Running Spikes": "Designed for explosive speed, the Titan Track Spikes are the ultimate weapon for sprinters and middle-distance runners. The ultra-lightweight mesh upper provides maximum breathability and a locked-in fit, while the aggressive 7-spike plate delivers unparalleled traction and energy return. Featuring a responsive foam midsole that absorbs impact without compromising speed. Dominate the track with footwear built for podium finishes.",
    "Volleyball": "Elevate your game with the Quantum Spike Ball. This professional-grade volleyball features a premium micro-fiber composite cover that feels soft on the hands while providing the durability needed for high-velocity spikes. The 18-panel hand-sewn construction ensures a perfectly aerodynamic flight and consistent bounce. Its vibrant color pattern is designed for tracking rotations even under bright stadium lights.",
    "Soccer Ball": "The Vortex Elite Match Ball is a FIFA Quality Pro certified ball designed for the highest level of competition. Its thermally bonded, seamless surface ensures a predictable trajectory, better touch, and minimal water intake. The high-rebound butyl bladder and 12-panel design provider superior air retention and structural integrity, allowing for pinpoint accuracy during long-range passes and powerful strikes.",
    "Cricket Bat": "Crafted from elite Grade 1 English Willow, the Maruthi Elite Bat is the pinnacle of cricket engineering. Hand-selected for its straight grains and massive sweet spot, this bat offers incredible power-to-weight ratio. The Sarawak Cane handle features multiple shock-absorbers for superior control and comfort during high-intensity strokes. Pre-knocked and ready for competitive play, it's the weapon of choice for top-order batsmen.",
    "Cricket Ball": "The Speedster Test Grade Leather Ball is meticulously hand-stitched using premium alum-tanned leather. Designed for 80+ overs of high-stakes play, it maintains its shape and hardness even in taxing sessions. The high-quality Portuguese cork core provides a consistent bounce, while the pronounced seam allows for significant swing and spin. Used in top-tier club and professional matches globally.",
    "Badminton Racket": "The NanoTech Strike Racket is engineered for players who crave speed and sharp offensive play. Utilizing a high-modulus graphite frame with NanoCarbon technology, it's incredibly stiff and lightweight. The aerodynamic frame design reduces air resistance, allowing for lightning-fast racquet-head speed. Its head-heavy balance provides the crushing power needed for unreturnable smashes, while the slim shaft ensures precise control.",
    "Football Boots": "Unleash your agility with AeroStream Phantom Boots. These lightweight boots feature a synthetic micro-textured upper for enhanced ball control at high speeds. The multi-stud configuration provides exceptional traction on both natural and artificial turf, allowing for quick cuts and explosive acceleration. The cushioned sock-liner ensures comfort for the full 90 minutes, making them essential for any dynamic playmaker.",
    "Dumbbell Set": "Maximize your home gym efficiency with the Titan Adjustable Dumbbell Set. Replacing multiple pairs of weights, this space-saving set allows you to adjust the load in seconds with a simple dial mechanism. Crafted from high-durability steel and coated in high-impact plastic for quiet performance. Perfect for everything from light lateral raises to heavy chest presses. Includes a custom stand for easy storage and access.",
    "Swimming Goggles": "Engineered for clarity and comfort, HydroFit Goggles feature high-definition peripheral lenses with advanced anti-fog treatment. The soft silicone gaskets provide a leak-proof seal without causing excessive pressure on the eye sockets. The split-strap design ensures a secure fit during racing starts and turns. 100% UV protection makes them suitable for both indoor pools and open water training.",
    "Tennis Racket": "The AeroStream Graphite Racket is built for players who want to dominate the baseline with power and spin. The high-modulus graphite construction provides exceptional frame stability, while the open string pattern allows for massive topspin. The shock-dampening technology in the handle reduces fatigue during long rallies. A perfectly balanced frame that offers a blend of explosive power and surgical precision."
};

const sampleReviewComments = [
    "Absolutely fantastic quality! Use it daily for my training sessions.",
    "Highly recommended for serious athletes. The durability is impressive.",
    "Met all my expectations. The grip and performance are top-notch.",
    "Great value for money. Better than many expensive alternatives I've tried.",
    "Perfect for competitive play. Really helps in improving my technique.",
    "Excellent build quality and very comfortable to use. 5 stars!",
    "Exactly as described. Fast shipping and premium packaging.",
    "The performance is elite level. I've noticed a real difference in my game.",
    "Strong and durable. It's survived some very intense sessions.",
    "The design is sleek and the functionality is flawless."
];

const seedContent = async () => {
    try {
        await connectDB();

        const admin = await User.findOne({ isAdmin: true }) || await User.findOne();
        if (!admin) {
            console.error('No users found in database. Please register a user first.');
            process.exit(1);
        }

        const users = await User.find({}).limit(5);

        const products = await Product.find({});
        console.log(`Updating ${products.length} products...`);

        for (const product of products) {
            // Update Description
            if (detailedDescriptions[product.name]) {
                product.description = detailedDescriptions[product.name];
            } else {
                product.description = `Experience ultimate performance with the ${product.name}. Engineered for ${product.category} enthusiasts, this ${product.brand} product combines durability with high-end functionality for both professional and recreational use.`;
            }

            // Generate Reviews if missing
            if (product.reviews.length === 0) {
                const numReviewsToSeed = Math.floor(Math.random() * 3) + 3; // 3 to 5 reviews
                const reviews = [];

                for (let i = 0; i < numReviewsToSeed; i++) {
                    const reviewer = users[i % users.length];
                    reviews.push({
                        name: reviewer.name,
                        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 star reviews
                        comment: sampleReviewComments[Math.floor(Math.random() * sampleReviewComments.length)],
                        user: reviewer._id
                    });
                }

                product.reviews = reviews;
                product.numReviews = reviews.length;
                product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            }

            await product.save();
            console.log(`Updated: ${product.name}`);
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedContent();

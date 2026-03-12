const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const detailedDescriptions = {
    "Sky-High Pro Hoop": "Engineered for elite performance, the Sky-High Pro Hoop features a heavy-duty breakaway rim and a crystal-clear, shatterproof polycarbonate backboard. The pro-style spring action ensures a consistent bounce and safe dunks, while the weather-resistant plating makes it perfect for both intense indoor training and outdoor play.",
    "Cast Iron Kettlebell": "Take your strength training to the next level with our Cast Iron Kettlebells. Machined from a single solid piece of high-grade cast iron, these kettlebells are built to last a lifetime. The wide, ergonomic handle provides a secure grip for both single and double-handed exercises.",
    "Pro-Court Tennis Balls": "Experience professional-grade performance with Vortex Pro-Court Tennis Balls. These pressurized balls are crafted with premium wool felt and a specialized rubber core to deliver consistent bounce and exceptional visibility.",
    "Zenith Grip Basketball": "The Zenith Grip Basketball is designed for players who demand precision and control. Featuring a soft-touch composite cover with advanced moisture-wicking technology, it provides an unbeatable grip even during the most intense games.",
    "Titan Track Spikes": "Designed for explosive speed, the Titan Track Spikes are the ultimate weapon for sprinters and middle-distance runners. The ultra-lightweight mesh upper provides maximum breathability and a locked-in fit.",
    "Quantum Spike Ball": "Elevate your game with the Quantum Spike Ball. This professional-grade volleyball features a premium micro-fiber composite cover that feels soft on the hands while providing the durability needed for high-velocity spikes.",
    "Vortex Elite Match Ball": "The Vortex Elite Match Ball is a FIFA Quality Pro certified ball designed for the highest level of competition. Its thermally bonded, seamless surface ensures a predictable trajectory and better touch.",
    "Willow Master Pro Bat": "Crafted from elite Grade 1 English Willow, the Willow Master Pro Bat is the pinnacle of cricket engineering. Hand-selected for its straight grains and massive sweet spot, this bat offers incredible power-to-weight ratio.",
    "Test Grade Leather Ball": "The Test Grade Leather Ball is meticulously hand-stitched using premium alum-tanned leather. Designed for 80+ overs of high-stakes play, it maintains its shape and hardness even in taxing sessions.",
    "NanoStrike Racket": "The NanoStrike Racket is engineered for players who crave speed and sharp offensive play. Utilizing a high-modulus graphite frame with NanoCarbon technology, it's incredibly stiff and lightweight.",
    "Phantom Strike Boots": "Unleash your agility with Phantom Strike Boots. These lightweight boots feature a synthetic micro-textured upper for enhanced ball control at high speeds. The multi-stud configuration provides exceptional traction.",
    "Adjustable Dumbbell Set": "Maximize your home gym efficiency with the Titan Adjustable Dumbbell Set. Replacing multiple pairs of weights, this space-saving set allows you to adjust the load in seconds with a simple dial mechanism.",
    "Hydro-Speed Goggles": "Engineered for clarity and comfort, Hydro-Speed Goggles feature high-definition peripheral lenses with advanced anti-fog treatment. The soft silicone gaskets provide a leak-proof seal.",
    "Phantom Aero Racket": "The Phantom Aero Racket is built for players who want to dominate the baseline with power and spin. The high-modulus graphite construction provides exceptional frame stability."
};

const sportsProducts = [
    { name: "Sky-High Pro Hoop", category: "Basketball", brand: "Sky-High", price: 15999, image: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=2070&auto=format&fit=crop" },
    { name: "Cast Iron Kettlebell", category: "Gym", brand: "Titan", price: 2499, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop" },
    { name: "Pro-Court Tennis Balls", category: "Tennis", brand: "Vortex", price: 899, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop" },
    { name: "Zenith Grip Basketball", category: "Basketball", brand: "Zenith", price: 3499, image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2142&auto=format&fit=crop" },
    { name: "Titan Track Spikes", category: "Athletics", brand: "Titan", price: 6999, image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1974&auto=format&fit=crop" },
    { name: "Quantum Spike Ball", category: "Volleyball", brand: "Quantum", price: 1899, image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2070&auto=format&fit=crop" },
    { name: "Vortex Elite Match Ball", category: "Football", brand: "Vortex", price: 4599, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop" },
    { name: "Willow Master Pro Bat", category: "Cricket", brand: "Maruthi", price: 12999, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop" },
    { name: "Test Grade Leather Ball", category: "Cricket", brand: "Maruthi", price: 1499, image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2074&auto=format&fit=crop" },
    { name: "NanoStrike Racket", category: "Badminton", brand: "NanoTech", price: 5499, image: "https://images.unsplash.com/photo-1610970881699-44a5587cab28?q=80&w=800&auto=format&fit=crop" },
    { name: "Phantom Strike Boots", category: "Football", brand: "AeroStream", price: 8999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" },
    { name: "Adjustable Dumbbell Set", category: "Gym", brand: "Titan", price: 18999, image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070&auto=format&fit=crop" },
    { name: "Hydro-Speed Goggles", category: "Swimming", brand: "HydroFit", price: 1299, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop" },
    { name: "Phantom Aero Racket", category: "Tennis", brand: "AeroStream", price: 14499, image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=800&auto=format&fit=crop" }
];

const sampleReviewComments = [
    "Absolutely fantastic quality! Use it daily for my training sessions.",
    "Highly recommended for serious athletes. The durability is impressive.",
    "Met all my expectations. The grip and performance are top-notch.",
    "Great value for money. Better than many expensive alternatives I've tried.",
    "Excellent build quality and very comfortable to use. 5 stars!"
];

const resetSports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const admin = await User.findOne({ isAdmin: true }) || await User.findOne();
        if (!admin) {
            console.error('No users found.');
            process.exit(1);
        }

        const users = await User.find({}).limit(5);

        await Product.deleteMany({});
        console.log('Cleared all products.');

        for (const item of sportsProducts) {
            const product = new Product({
                ...item,
                user: admin._id,
                description: detailedDescriptions[item.name] || `Premium ${item.name} for ${item.category}.`,
                numReviews: 0,
                rating: 0,
                reviews: [],
                countInStock: 20
            });

            const numReviews = 3;
            for (let i = 0; i < numReviews; i++) {
                const reviewer = users[i % users.length];
                product.reviews.push({
                    name: reviewer.name,
                    rating: 5,
                    comment: sampleReviewComments[Math.floor(Math.random() * sampleReviewComments.length)],
                    user: reviewer._id
                });
            }
            product.numReviews = product.reviews.length;
            product.rating = 5;

            await product.save();
            console.log(`Seeded: ${product.name}`);
        }

        console.log('Sports data hard reset complete!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetSports();

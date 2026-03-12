const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed Vinayaga content...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const vinayagaProducts = [
    {
        name: "Premium Teak Plywood",
        brand: "TeakMaster",
        category: "Plywood",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070&auto=format&fit=crop",
        description: "Experience the timeless beauty and unparalleled strength of our Premium Teak Plywood. Sourced from sustainable plantations, this plywood features a rich, golden-brown teak veneer that adds a touch of luxury to any interior. Its high-density core ensures exceptional screw-holding capacity and resistance to warping, making it the preferred choice for high-end furniture and decorative cabinetry. Calibrated to perfection for a smooth, uniform finish.",
        price: 4500,
        countInStock: 25
    },
    {
        name: "Marine Grade Waterproof Plywood",
        brand: "AquaShield",
        category: "Plywood",
        image: "https://images.unsplash.com/photo-1541888941294-6338d3f1aa8d?q=80&w=2070&auto=format&fit=crop",
        description: "Built to withstand the toughest conditions, our Marine Grade Waterproof Plywood is engineered for durability in moisture-prone areas. Utilizing high-quality hardwood veneers and specialized waterproof resin, it prevents delamination even when exposed to direct water. Ideal for kitchen cabinets, bathroom vanities, and outdoor structures. This IS 710 certified plywood offers peace of mind with its superior resistance to termites and borer.",
        price: 3200,
        countInStock: 50
    },
    {
        name: "Tempered Glass Sheet",
        brand: "ClearVision",
        category: "Glass",
        image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop",
        description: "Our Tempered Glass Sheets offer the perfect combination of safety and elegance. Processed through controlled thermal treatment, this glass is four to five times stronger than standard annealed glass. In the rare event of breakage, it shatters into small, blunt fragments, significantly reducing the risk of injury. Perfect for glass doors, shower enclosures, partitions, and tabletop protectors. Available in various thicknesses from 6mm to 19mm.",
        price: 1800,
        countInStock: 30
    },
    {
        name: "Frosted Decorative Glass",
        brand: "OpaqueStyle",
        category: "Glass",
        image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070&auto=format&fit=crop",
        description: "Add privacy and a touch of modern aesthetics to your space with our Frosted Decorative Glass. This glass features a high-quality sandblasted or acid-etched finish that diffuses light while obscuring visibility. Perfect for office partitions, bathroom windows, and decorative furniture inserts. It allows natural light to flow through while creating a sophisticated, contemporary vibe in any room. Easy to clean and resistant to fingerprint marks.",
        price: 2200,
        countInStock: 15
    },
    {
        name: "Luxury Laminate Sheets",
        brand: "DecoLam",
        category: "Laminates",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
        description: "Transform your surfaces with our Luxury Laminate Sheets. Featuring a wide range of textures from natural wood grains to matte and high-gloss finishes, these laminates are designed to satisfy every design palate. They are highly resistant to scratches, heat, and moisture, ensuring long-lasting beauty for your furniture and wall panels. Anti-bacterial properties make them ideal for kitchen countertops and dining tables.",
        price: 1500,
        countInStock: 100
    },
    {
        name: "Full Body Wall Mirror",
        brand: "ReflectPro",
        category: "Glass",
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1974&auto=format&fit=crop",
        description: "Enhance the perception of space and light in your home with our Full Body Wall Mirror. Crafted from high-clarity copper-free glass, this mirror provides a crisp, distortion-free reflection. The edges are precision-polished for safety and a sleek look. Perfect for dressing rooms, bedrooms, or as a statement piece in your living area. Comes with professional mounting hardware for easy installation on any wall surface.",
        price: 5500,
        countInStock: 12
    },
    {
        name: "Birch Plywood",
        brand: "EuroWoods",
        category: "Plywood",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        description: "Our Birch Plywood is celebrated for its multi-ply construction and exceptional strength-to-weight ratio. The cross-laminated layering provides incredible stability and a beautiful edge detail that is often left exposed in modern furniture design. Its smooth, pale surface takes stains and paints beautifully, making it a favorite among architects and contemporary designers. High load-bearing capacity for shelving and structural applications.",
        price: 3800,
        countInStock: 40
    }
];

const sampleReviews = [
    "The quality of the plywood is exceptional. Very few gaps in the core and the veneer is beautiful.",
    "Installed the tempered glass for my shower partition. Extremely sturdy and the finish is perfect.",
    "The mirror arrived in perfect condition. Great clarity and looks very premium on the wall.",
    "Used the marine plywood for my kitchen cabinets. Really happy with the water resistance so far.",
    "The frosted glass provides the perfect level of privacy for my office cabin. Highly recommended.",
    "Best plywood I've used for my furniture projects. Strong and very easy to work with.",
    "The laminates have a great texture and the anti-scratch coating works as advertised.",
    "Professional service and top-notch materials for my new home interiors."
];

const seedVinayaga = async () => {
    try {
        await connectDB();

        // Find an admin user to associate products with
        const admin = await User.findOne({ isAdmin: true }) || await User.findOne();
        if (!admin) {
            console.error('No users found in database.');
            process.exit(1);
        }

        const users = await User.find({}).limit(5);

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Seed new products
        for (const item of vinayagaProducts) {
            const product = new Product({
                ...item,
                user: admin._id,
                rating: 0,
                numReviews: 0,
                reviews: [],
                colors: ["Natural", "Matte", "Glossy"],
                sizes: ["8x4 ft", "7x3 ft", "Custom"]
            });

            // Add reviews
            const numReviewsToSeed = Math.floor(Math.random() * 3) + 3;
            const reviews = [];
            for (let i = 0; i < numReviewsToSeed; i++) {
                const reviewer = users[i % users.length];
                reviews.push({
                    name: reviewer.name,
                    rating: Math.floor(Math.random() * 2) + 4,
                    comment: sampleReviews[Math.floor(Math.random() * sampleReviews.length)],
                    user: reviewer._id
                });
            }

            product.reviews = reviews;
            product.numReviews = reviews.length;
            product.rating = reviews.reduce((acc, r) => r.rating + acc, 0) / reviews.length;

            await product.save();
            console.log(`Seeded: ${product.name}`);
        }

        console.log('Vinayaga Glass & Plywoods products seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedVinayaga();

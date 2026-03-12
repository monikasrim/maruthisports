import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaStar,
    FaShoppingCart,
    FaQuoteLeft,
    FaShieldAlt,
    FaTruck,
    FaHeadset,
    FaTag,
    FaFire,
    FaMedal,
    FaTrophy,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Home = () => {
    const { addToCart } = useCart();
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop',
            badge: '🏏 Cricket Season Sale',
            heading: 'Play Hard.',
            subheading: 'Win Bigger.',
            desc: 'Top cricket gear — bats, gloves, helmets & more from SG, SS, Kookaburra.',
            cta: 'Shop Cricket',
            link: '/shop?category=Cricket',
            accent: '#f97316',
        },
        {
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
            badge: '⚽ Football Collection',
            heading: 'Striker Ready.',
            subheading: 'Own the Pitch.',
            desc: 'Premium football boots, jerseys, and balls for every level of the game.',
            cta: 'Shop Football',
            link: '/shop?category=Football',
            accent: '#22c55e',
        },
        {
            image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070&auto=format&fit=crop',
            badge: '🏋️ Fitness & Gym Gear',
            heading: 'Train Harder.',
            subheading: 'Build Stronger.',
            desc: 'Dumbbells, resistance bands, yoga mats — everything for your home gym.',
            cta: 'Shop Fitness',
            link: '/shop?category=Fitness',
            accent: '#a855f7',
        },
        {
            image: 'https://images.unsplash.com/photo-1610970881699-44a5587cab28?q=80&w=1600&auto=format&fit=crop',
            badge: '🏸 Badminton Essentials',
            heading: 'Smash It.',
            subheading: 'Dominate the Court.',
            desc: 'Yonex rackets, shuttlecocks, grip tapes and more at unbeatable prices.',
            cta: 'Shop Badminton',
            link: '/shop?category=Badminton',
            accent: '#06b6d4',
        },
    ];

    const nextSlide = () => setCurrentSlide(p => (p + 1) % slides.length);
    const prevSlide = () => setCurrentSlide(p => (p - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(nextSlide, 4500);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/top`);
                setTopProducts(data);
            } catch (error) {
                console.error('Error fetching top products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    const categories = [
        {
            name: 'Cricket',
            icon: '🏏',
            color: 'from-blue-600 to-blue-800',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop',
            description: 'Bats, Balls, Gloves & More',
            count: '120+ Products',
        },
        {
            name: 'Football',
            icon: '⚽',
            color: 'from-orange-500 to-orange-700',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
            description: 'Boots, Jerseys, Balls & More',
            count: '95+ Products',
        },
        {
            name: 'Fitness',
            icon: '🏋️',
            color: 'from-violet-600 to-violet-800',
            image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070&auto=format&fit=crop',
            description: 'Weights, Bands, Mats & More',
            count: '200+ Products',
        },
        {
            name: 'Badminton',
            icon: '🏸',
            color: 'from-emerald-500 to-emerald-700',
            image: 'https://images.unsplash.com/photo-1610970881699-44a5587cab28?q=80&w=800&auto=format&fit=crop',
            description: 'Rackets, Shuttles & More',
            count: '80+ Products',
        },
        {
            name: 'Basketball',
            icon: '🏀',
            color: 'from-red-500 to-red-700',
            image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2142&auto=format&fit=crop',
            description: 'Balls, Shoes, Hoops & More',
            count: '60+ Products',
        },
        {
            name: 'Accessories',
            icon: '🎽',
            color: 'from-slate-600 to-slate-800',
            image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2070&auto=format&fit=crop',
            description: 'Bags, Bottles, Bands & More',
            count: '150+ Products',
        },
    ];

    const brands = [
        { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' },
        { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png' },
        { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1280px-Puma_Logo.svg.png' },
        { name: 'Yonex', logo: null },
        { name: 'SG', logo: null },
        { name: 'Cosco', logo: null },
    ];

    const testimonials = [
        {
            name: 'Arjun Sharma',
            role: 'Professional Cricketer',
            avatar: 'AS',
            rating: 5,
            color: 'bg-blue-600',
            review: 'Best sports store in the area! The cricket gear quality is excellent and the prices are very competitive. I bought my SG bat here and absolutely love it.',
        },
        {
            name: 'Priya Menon',
            role: 'Fitness Trainer',
            avatar: 'PM',
            rating: 5,
            color: 'bg-orange-500',
            review: 'Amazing collection of fitness equipment. Fast delivery and the customer support team is super helpful. Highly recommend to all fitness enthusiasts!',
        },
        {
            name: 'Rahul Nair',
            role: 'Football Coach',
            avatar: 'RN',
            rating: 5,
            color: 'bg-emerald-600',
            review: 'Ordered football jerseys and boots for my entire team. The quality is top-notch and the pricing for bulk orders was very reasonable. Great experience!',
        },
        {
            name: 'Kavya Reddy',
            role: 'Badminton Player',
            avatar: 'KR',
            rating: 5,
            color: 'bg-violet-600',
            review: 'Great selection of Yonex rackets and shuttles. The product descriptions are accurate and shipping was very fast. Will definitely shop again!',
        },
    ];

    const features = [
        { icon: <FaTruck />, title: 'Free Delivery', desc: 'On orders above ₹999', color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: <FaShieldAlt />, title: 'Genuine Products', desc: '100% authentic brands', color: 'text-orange-500', bg: 'bg-orange-50' },
        { icon: <FaTag />, title: 'Best Prices', desc: 'Competitive pricing always', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: <FaHeadset />, title: '24/7 Support', desc: 'Always here to help you', color: 'text-violet-600', bg: 'bg-violet-50' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

            {/* ───────── HERO SLIDER ───────── */}
            <section className="relative w-full overflow-hidden" style={{ marginTop: '80px' }}>
                {/* Slides */}
                <div className="relative w-full" style={{ height: 'clamp(320px, 58vw, 620px)' }}>
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 w-full h-full"
                            style={{ opacity: i === currentSlide ? 1 : 0, transition: 'opacity 0.7s ease-in-out', zIndex: i === currentSlide ? 1 : 0 }}
                        >
                            {/* Background image */}
                            <img
                                src={slide.image}
                                alt={slide.badge}
                                className="w-full h-full object-cover"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,15,35,0.82) 0%, rgba(5,15,35,0.5) 50%, rgba(5,15,35,0.15) 100%)' }}></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
                                    <div className="max-w-xl space-y-5">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white border border-white/20" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                                            {slide.badge}
                                        </div>
                                        <h1 className="font-black leading-none text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                                            {slide.heading}<br />
                                            <span style={{ color: slide.accent }}>{slide.subheading}</span>
                                        </h1>
                                        <p className="text-white/75 text-base leading-relaxed max-w-md">{slide.desc}</p>
                                        <Link
                                            to={slide.link}
                                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-sm shadow-xl"
                                            style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)` }}
                                        >
                                            <FaShoppingCart /> {slide.cta} <FaArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl"
                        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl"
                        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
                    >
                        <FaChevronRight />
                    </button>

                    {/* Dot Navigation */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className="rounded-full transition-all"
                                style={{
                                    width: i === currentSlide ? '28px' : '8px',
                                    height: '8px',
                                    background: i === currentSlide ? slides[currentSlide].accent : 'rgba(255,255,255,0.45)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Slide counter */}
                    <div className="absolute top-4 right-4 z-10 text-white/60 text-xs font-bold" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: '999px' }}>
                        {currentSlide + 1} / {slides.length}
                    </div>
                </div>
            </section>

            {/* ───────── FEATURES STRIP ───────── */}
            <section className="py-10 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className={`${f.bg} ${f.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm">{f.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── SHOP BY CATEGORY ───────── */}
            <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <FaTag /> Browse by Sport
                    </div>
                    <h2 className="text-4xl font-black text-slate-900">Shop by <span className="text-blue-600">Category</span></h2>
                    <p className="text-slate-500 mt-3 max-w-md mx-auto">Find the perfect equipment for every sport you love.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCategory(i)}
                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-bold text-sm cursor-pointer ${
                                activeCategory === i
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50'
                            }`}
                        >
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="text-center leading-tight">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Active Category Card */}
                <Link
                    to={`/shop?category=${categories[activeCategory].name}`}
                    className="group relative h-64 sm:h-80 rounded-3xl overflow-hidden flex items-end p-8 shadow-xl"
                >
                    <img
                        src={categories[activeCategory].image}
                        alt={categories[activeCategory].name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                    <div className="relative z-10 flex justify-between items-end w-full">
                        <div>
                            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">{categories[activeCategory].count}</p>
                            <h3 className="text-3xl font-black text-white">{categories[activeCategory].name}</h3>
                            <p className="text-slate-300 text-sm mt-1">{categories[activeCategory].description}</p>
                        </div>
                        <div className="bg-orange-500 text-white p-4 rounded-xl flex items-center gap-2 font-bold group-hover:bg-orange-400 transition-colors">
                            Shop Now <FaArrowRight />
                        </div>
                    </div>
                </Link>
            </section>

            {/* ───────── FEATURED PRODUCTS ───────── */}
            <section className="py-20" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                                <FaFire /> Hot Right Now
                            </div>
                            <h2 className="text-4xl font-black text-slate-900">Featured <span className="text-blue-600">Products</span></h2>
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                            View All <FaArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                                    <div className="bg-slate-100 rounded-2xl h-48 mb-4"></div>
                                    <div className="bg-slate-100 h-4 rounded mb-2"></div>
                                    <div className="bg-slate-100 h-4 w-2/3 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topProducts.map((prod) => (
                                <div
                                    key={prod._id}
                                    className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                                    style={{ transition: 'box-shadow 0.3s, transform 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(59,130,246,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Product Image */}
                                    <div className="relative bg-slate-50 p-6 flex items-center justify-center" style={{ height: '200px' }}>
                                        <img
                                            src={prod.image?.startsWith('http') ? prod.image : `${API_URL}${prod.image}`}
                                            alt={prod.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                        {/* Badge */}
                                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                                            Hot
                                        </div>
                                        {/* Quick Add */}
                                        <button
                                            onClick={() => { addToCart(prod); toast.success(`${prod.name} added to cart!`); }}
                                            className="absolute bottom-3 right-3 bg-blue-600 text-white p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <FaShoppingCart />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={`text-xs ${i < Math.round(prod.rating) ? 'text-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                            <span className="text-slate-400 text-xs ml-1 font-semibold">({prod.rating})</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2 flex-1 line-clamp-2">{prod.name}</h3>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                            <p className="text-xl font-black text-blue-600">₹{prod.price?.toLocaleString()}</p>
                                            <Link
                                                to={`/product/${prod._id}`}
                                                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                            >
                                                Details <FaArrowRight />
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => { addToCart(prod); toast.success(`${prod.name} added to cart!`); }}
                                            className="mt-3 w-full py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ───────── BRANDS BANNER ───────── */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                            <FaCheckCircle className="text-emerald-500" /> Official Partners
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Top <span className="text-orange-500">Brands</span> We Carry</h2>
                        <p className="text-slate-500 text-sm mt-2">We source only from the world's most trusted sporting brands.</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10">
                        {brands.map((brand, i) => (
                            <div
                                key={i}
                                className="bg-slate-50 rounded-2xl px-8 py-5 flex items-center justify-center border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all"
                                style={{ minWidth: '130px', height: '80px' }}
                            >
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 max-w-[100px]"
                                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <span
                                    className="font-black text-xl tracking-tight text-slate-400 hover:text-slate-700 transition-colors select-none"
                                    style={{ display: brand.logo ? 'none' : 'flex' }}
                                >
                                    {brand.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── PROMOTIONAL BANNER ───────── */}
            <section className="py-20 px-4">
                <div
                    className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}
                >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 60%)', backgroundPosition: 'top right', backgroundSize: '600px 600px', backgroundRepeat: 'no-repeat' }}></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-12 gap-8">
                        <div>
                            <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Limited Time Offer</span>
                            <h2 className="text-4xl font-black text-white mt-2">
                                Up to <span className="text-orange-400">40% OFF</span> on<br />
                                Cricket Equipment
                            </h2>
                            <p className="text-slate-300 mt-3 max-w-md">
                                Shop premium bats, gloves, helmets and protective gear from top brands like SG, SS, Kookaburra, and more.
                            </p>
                        </div>
                        <Link
                            to="/shop?category=Cricket"
                            className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-base shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                        >
                            Grab the Deal <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ───────── TESTIMONIALS ───────── */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            <FaStar /> Customer Reviews
                        </div>
                        <h2 className="text-4xl font-black text-slate-900">What Our <span className="text-blue-600">Athletes</span> Say</h2>
                        <p className="text-slate-500 mt-3">Join thousands of happy customers across India.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-xl hover:shadow-blue-50 transition-all"
                            >
                                <FaQuoteLeft className="text-blue-100 text-3xl" />
                                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.review}"</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <FaStar key={j} className="text-amber-400 text-xs" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                                    <div className={`${t.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">{t.name}</p>
                                        <p className="text-slate-400 text-xs font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── CTA SECTION ───────── */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <FaTrophy /> Your Victory Starts Here
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                        Ready to Level Up<br />
                        <span className="text-blue-600">Your Game?</span>
                    </h2>
                    <p className="text-slate-500 text-lg mb-8">
                        Browse over 500 premium sports products. Free delivery on orders above ₹999.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-white font-black text-base shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                        >
                            <FaShoppingCart /> Shop Full Collection
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;

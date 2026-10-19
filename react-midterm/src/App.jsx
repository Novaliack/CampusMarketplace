import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './marketplace.css'

const CATEGORIES = ['Textbooks', 'Calculators', 'Stationery', 'Dorm Supplies', 'Club Merch']
const SEED_PRODUCTS = [
  { id: 1, title: 'Calculus: Early Transcendentals, 8th Edition', category: 'Textbooks', price: 1200, condition: 'Like New', description: 'Gently used throughout one semester. Includes access code card (unused) and original dust jacket. A great companion for MATH 101 and 102.', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=85', sellerId: 'u2', sellerName: 'Maria S.', courseCode: 'MATH 101', isSold: false, createdAt: '2026-10-15' },
  { id: 2, title: 'Casio fx-991EX Scientific Calculator', category: 'Calculators', price: 650, condition: 'Used', description: 'Fully working, clear display, and comes with its hard case. Perfect for engineering and science courses.', imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=1000&q=85', sellerId: 'u1', sellerName: 'Jordan Lee', courseCode: 'ENG 201', isSold: false, createdAt: '2026-10-12' },
  { id: 3, title: 'Campus Hoodie, Maroon (M)', category: 'Club Merch', price: 950, condition: 'Like New', description: 'Official campus hoodie in maroon. Size medium, worn only a few times. Soft fleece lining and no marks.', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85', sellerId: 'u3', sellerName: 'Kai R.', courseCode: '', isSold: false, createdAt: '2026-10-10' },
  { id: 4, title: 'Gel Pen Set, 24 Colors', category: 'Stationery', price: 180, condition: 'New', description: 'A full set of 24 colorful gel pens. All unused and tested. Great for notes, planners, and art projects.', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85', sellerId: 'u2', sellerName: 'Maria S.', courseCode: '', isSold: false, createdAt: '2026-10-08' },
  { id: 5, title: 'Mini LED Desk Lamp (USB)', category: 'Dorm Supplies', price: 320, condition: 'Like New', description: 'Compact dimmable lamp with a flexible neck and USB power. Works perfectly for late-night study sessions.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85', sellerId: 'u1', sellerName: 'Jordan Lee', courseCode: '', isSold: false, createdAt: '2026-10-06' },
  { id: 6, title: 'Organic Chemistry Lab Manual', category: 'Textbooks', price: 400, condition: 'Used', description: 'A few notes in pencil, otherwise in good shape. Updated edition for CHEM 221 lab.', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=85', sellerId: 'u4', sellerName: 'Sofia P.', courseCode: 'CHEM 221', isSold: false, createdAt: '2026-10-04' },
  { id: 7, title: 'Physics for Scientists & Engineers', category: 'Textbooks', price: 950, condition: 'Used', description: 'Complete textbook with a few highlighted sections. No loose pages; good condition overall.', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=85', sellerId: 'u3', sellerName: 'Kai R.', courseCode: 'PHYS 150', isSold: false, createdAt: '2026-10-02' },
  { id: 8, title: 'Engineering Drawing Handbook', category: 'Textbooks', price: 350, condition: 'Like New', description: 'Clean copy with all diagrams intact. A useful reference for first-year engineering drawing.', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85', sellerId: 'u4', sellerName: 'Sofia P.', courseCode: 'ENG 105', isSold: false, createdAt: '2026-09-28' },
  { id: 9, title: 'Campus Notebook, 3-Pack', category: 'Stationery', price: 120, condition: 'New', description: 'Three ruled notebooks with sturdy covers. Never opened, ready for a new semester.', imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85', sellerId: 'u1', sellerName: 'Jordan Lee', courseCode: '', isSold: true, createdAt: '2026-09-24' },
  { id: 10, title: 'Desk Organizer Set', category: 'Dorm Supplies', price: 280, condition: 'Used', description: 'Wood desk organizer with compartments for pens, notes, and small essentials.', imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85', sellerId: 'u2', sellerName: 'Maria S.', courseCode: '', isSold: false, createdAt: '2026-09-21' },
]
const CURRENT_USER = { id: 'u1', name: 'Jordan Lee', email: 'jordan.lee@campus.edu' }
const MarketContext = createContext(null)
const readSaved = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function MarketProvider({ children }) {
  const [products, setProducts] = useState(() => readSaved('campus-products', SEED_PRODUCTS))
  const [cart, setCart] = useState(() => readSaved('campus-cart', []))
  const [recentlyViewed, setRecentlyViewed] = useState(() => readSaved('campus-recent', []))
  const [orders, setOrders] = useState(() => readSaved('campus-orders', []))
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => { localStorage.setItem('campus-products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('campus-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('campus-recent', JSON.stringify(recentlyViewed)) }, [recentlyViewed])
  useEffect(() => { localStorage.setItem('campus-orders', JSON.stringify(orders)) }, [orders])
  const addProduct = (product) => setProducts((current) => [{ ...product, id: Date.now(), sellerId: CURRENT_USER.id, sellerName: CURRENT_USER.name, isSold: false, createdAt: new Date().toISOString().slice(0, 10) }, ...current])
  const updateProduct = (id, changes) => setProducts((current) => current.map((product) => product.id === id ? { ...product, ...changes } : product))
  const deleteProduct = (id) => {
    setProducts((current) => current.filter((product) => product.id !== id))
    setCart((current) => current.filter((item) => item.productId !== id))
    setRecentlyViewed((current) => current.filter((productId) => productId !== id))
  }
  const addToCart = (productId) => setCart((current) => {
    const found = current.find((item) => item.productId === productId)
    return found ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, quantity: 1 }]
  })
  const updateQuantity = (productId, quantity) => setCart((current) => quantity < 1 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(quantity, 9) } : item))
  const removeFromCart = (productId) => setCart((current) => current.filter((item) => item.productId !== productId))
  const clearCart = () => setCart([])
  const addRecentlyViewed = useCallback((productId) => setRecentlyViewed((current) => [productId, ...current.filter((id) => id !== productId)].slice(0, 6)), [])
  const clearRecentlyViewed = () => setRecentlyViewed([])
  const placeOrder = (order) => {
    const total = getCartTotal()
    setOrders((current) => [{ ...order, id: `CM-${Date.now().toString().slice(-6)}`, items: cart, total }, ...current])
    setProducts((current) => current.map((product) => cart.some((item) => item.productId === product.id) ? { ...product, isSold: true } : product))
    return total
  }
  const getCartTotal = () => cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0)
  return <MarketContext.Provider value={{ products, cart, recentlyViewed, currentUser: CURRENT_USER, isLoading, orders, addProduct, updateProduct, deleteProduct, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, addRecentlyViewed, clearRecentlyViewed, placeOrder }}>{children}</MarketContext.Provider>
}
const useMarket = () => useContext(MarketContext)
const money = (value) => `₱${Number(value).toLocaleString('en-PH')}`

function Header() {
  const { cart } = useMarket()
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  return <header className="site-header"><div className="nav-wrap"><Link to="/" className="brand"><span className="brand-mark">C</span><span>Campus <b>Marketplace</b></span></Link><nav className="main-nav" aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/shop">Shop</NavLink><NavLink to="/sell">Sell</NavLink><NavLink to="/my-listings">My Listings</NavLink></nav><Link className="cart-link" to="/cart">Cart <span>{count}</span></Link></div></header>
}
function Footer() { return <footer className="site-footer"><div><strong>Campus Marketplace</strong><span>Student-to-student. Meet at campus pickup points.</span></div></footer> }
function PageShell({ children }) { return <><Header/><main className="page-shell">{children}</main><Footer/></> }
function SectionTitle({ eyebrow, title, action, to = '/shop' }) { return <div className="section-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action && <Link to={to} className="text-link">{action} <span aria-hidden="true">→</span></Link>}</div> }
function ProductCard({ product, compact = false }) {
  const { addToCart } = useMarket()
  return <article className={`product-card ${compact ? 'product-card-compact' : ''}`}><Link to={`/product/${product.id}`} className="product-image-wrap"><img src={product.imageUrl} alt={product.title} loading="lazy"/><span className="image-category">{product.category}</span></Link><div className="product-info"><div className="product-kicker"><span>{product.condition}</span>{product.courseCode && <span>{product.courseCode}</span>}</div><Link to={`/product/${product.id}`} className="product-name">{product.title}</Link><div className="product-bottom"><div><strong>{money(product.price)}</strong><span>Seller · {product.sellerName}</span></div><button className="add-button" onClick={() => addToCart(product.id)} aria-label={`Add ${product.title} to cart`} title="Add to cart">+</button></div></div></article>
}
function EmptyState({ icon = '○', title, description, action, to = '/shop', onAction }) { return <div className="empty-state"><span className="empty-icon">{icon}</span><h3>{title}</h3><p>{description}</p>{action && (onAction ? <button className="button button-primary" onClick={onAction}>{action}</button> : <Link className="button button-primary" to={to}>{action}</Link>)}</div> }
function LoadingGrid() { return <div className="product-grid">{[0, 1, 2, 3].map((item) => <div className="skeleton-card" key={item}><div className="skeleton-image shimmer"/><div className="skeleton-line shimmer"/><div className="skeleton-line short shimmer"/></div>)}</div> }
function RecentlyViewed({ ids }) {
  const { products, clearRecentlyViewed } = useMarket()
  const items = ids.map((id) => products.find((product) => product.id === id)).filter(Boolean)
  return <section className="recent-section"><div className="section-title"><div><h2>Recently viewed</h2></div>{items.length > 0 && <button className="clear-button" onClick={clearRecentlyViewed}>Clear</button>}</div>{items.length ? <div className="product-grid recent-grid">{items.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} compact/>)}</div> : <div className="recent-empty">Your recently viewed items will show up here.</div>}</section>
}
function HomePage() {
  const { products, recentlyViewed, isLoading } = useMarket()
  const navigate = useNavigate()
  const active = products.filter((product) => !product.isSold)
  const featured = active.slice(0, 4)
  return <PageShell><section className="hero"><div className="hero-copy"><span className="eyebrow hero-eyebrow">THE CAMPUS EXCHANGE</span><h1>Good finds.<br/><em>Better semesters.</em></h1><p>Buy and sell the things that get you through campus life. Local, easy, and made for students.</p><form className="hero-search" onSubmit={(event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(new FormData(event.currentTarget).get('q'))}`) }}><span aria-hidden="true">⌕</span><input name="q" aria-label="Search listings" placeholder="Search textbooks, calculators, dorm gear..."/><button type="submit" className="button button-primary">Search</button></form><div className="hero-note"><span className="note-dot"/>Meet on campus. Skip the shipping.</div></div><div className="hero-art"><img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=85" alt="Sunlit university library study table"/><div className="hero-badge"><span>Made for</span><strong>student<br/>to student</strong><span className="badge-arrow">↗</span></div><div className="hero-caption"><span>01 / CAMPUS LIFE</span><span>Pass it along.</span></div></div></section>
    <section className="category-section"><SectionTitle eyebrow="A LITTLE OF EVERYTHING" title="Shop by category" action="Browse all"/><div className="category-grid">{CATEGORIES.map((category, index) => <Link to={`/shop?category=${encodeURIComponent(category)}`} className={`category-tile category-tone-${index + 1}`} key={category}><span className="category-number">0{index + 1}</span><span className="category-symbol">{['▤', '⌗', '✎', '⌂', '✳'][index]}</span><strong>{category}</strong><span className="category-arrow">↗</span></Link>)}</div></section>
    <section className="featured-section"><SectionTitle eyebrow="HANDPICKED FOR YOU" title="Featured finds" action="See all listings"/><p className="section-subtitle">Good stuff, still looking for its next student.</p>{isLoading ? <LoadingGrid/> : featured.length ? <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <EmptyState title="Nothing here yet" description="New campus finds are on their way." action="Browse listings"/>}</section>
    <RecentlyViewed ids={recentlyViewed}/></PageShell>
}
function ShopPage() {
  const { products, isLoading } = useMarket()
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(() => searchParams.get('q') || '')
  const [category, setCategory] = useState(() => searchParams.get('category') || 'All')
  const [condition, setCondition] = useState('All')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const listings = products.filter((product) => !product.isSold && (category === 'All' || product.category === category) && (condition === 'All' || product.condition === condition) && (!maxPrice || product.price <= Number(maxPrice)) && `${product.title} ${product.category} ${product.courseCode} ${product.description}`.toLowerCase().includes(keyword.trim().toLowerCase())).sort((a, b) => sortBy === 'price-low' ? a.price - b.price : sortBy === 'price-high' ? b.price - a.price : new Date(b.createdAt) - new Date(a.createdAt))
  const resetFilters = () => { setKeyword(''); setCategory('All'); setCondition('All'); setMaxPrice(''); setSortBy('newest') }
  return <PageShell><div className="page-heading"><div><span className="eyebrow">THE CAMPUS EXCHANGE</span><h1>Browse listings</h1><p>Find something useful. Pass something on.</p></div><span className="listing-total">{listings.length} listings</span></div><div className="shop-layout"><aside className="filters"><div className="filter-heading"><h2>Filters</h2><button type="button" className="clear-button" onClick={resetFilters}>Reset</button></div><label className="field-label">Search<input className="field-control" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Title, course, category"/></label><fieldset className="filter-group"><legend>Category</legend>{['All', ...CATEGORIES].map((item) => <label className="radio-row" key={item}><input type="radio" name="category" checked={category === item} onChange={() => setCategory(item)}/><span>{item}</span></label>)}</fieldset><fieldset className="filter-group"><legend>Condition</legend>{['All', 'New', 'Like New', 'Used'].map((item) => <label className="radio-row" key={item}><input type="radio" name="condition" checked={condition === item} onChange={() => setCondition(item)}/><span>{item}</span></label>)}</fieldset><label className="field-label">Maximum price<input type="number" min="0" className="field-control" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="No limit"/></label></aside><div className="shop-results"><div className="results-toolbar"><span>{listings.length} {listings.length === 1 ? 'result' : 'results'}</span><label>Sort by <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>{isLoading ? <LoadingGrid/> : listings.length ? <div className="product-grid">{listings.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <EmptyState icon="⌕" title="No listings match those filters" description="Try a different search or clear a filter to see more campus finds." action="Reset filters" onAction={resetFilters}/>}</div></div></PageShell>
}
function ProductDetailPage() {
  const { id } = useParams()
  const { products, addToCart, addRecentlyViewed } = useMarket()
  const product = products.find((item) => item.id === Number(id))
  const productId = product?.id
  useEffect(() => { if (productId) addRecentlyViewed(productId) }, [productId, addRecentlyViewed])
  if (!product) return <PageShell><EmptyState icon="?" title="Listing not found" description="It may have been removed or sold." action="Browse listings"/></PageShell>
  const related = products.filter((item) => item.category === product.category && item.id !== product.id && !item.isSold).slice(0, 4)
  return <PageShell><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>/</span><span>{product.title}</span></div><div className="detail-layout"><div className="detail-image"><img src={product.imageUrl} alt={product.title}/><span>{product.category}</span></div><div className="detail-copy"><div className="product-kicker"><span>{product.condition}</span>{product.courseCode && <span>{product.courseCode}</span>}</div><h1>{product.title}</h1><div className="detail-price">{money(product.price)} <span>Meetup pickup · free</span></div><p className="detail-description">{product.description}</p><div className="seller-panel"><div className="seller-avatar">{product.sellerName.slice(0, 1)}</div><div><strong>{product.sellerName}</strong><span>Campus seller · meets at Library lobby</span></div><span className="seller-check">✓</span></div><div className="detail-actions"><button className="button button-primary" onClick={() => addToCart(product.id)}>Add to cart <span>＋</span></button><button className="button button-outline" onClick={() => window.alert(`You can meet ${product.sellerName} at the campus pickup point after placing your order.`)}>Contact seller</button></div><div className="pickup-note"><span>⌖</span><div><strong>Easy campus pickup</strong><span>Coordinate a time at a familiar campus spot.</span></div></div></div></div>{related.length > 0 && <section className="related-section"><SectionTitle eyebrow="KEEP LOOKING" title={`More in ${product.category}`}/><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item}/>)}</div></section>}</PageShell>
}
function CartPage() {
  const { cart, products, updateQuantity, removeFromCart, getCartTotal } = useMarket()
  const rows = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) })).filter((item) => item.product)
  return <PageShell><div className="page-heading"><div><span className="eyebrow">YOUR CAMPUS FINDS</span><h1>Shopping cart</h1><p>{rows.length} items · campus pickup</p></div></div>{rows.length ? <div className="cart-layout"><div className="cart-items">{rows.map(({ product, quantity }) => <article className="cart-row" key={product.id}><Link className="cart-thumb" to={`/product/${product.id}`}><img src={product.imageUrl} alt=""/></Link><div className="cart-product"><Link to={`/product/${product.id}`}>{product.title}</Link><span>{product.condition} · {product.category}</span><button onClick={() => removeFromCart(product.id)} className="remove-button">Remove</button></div><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => updateQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => updateQuantity(product.id, quantity + 1)}>+</button></div><strong className="cart-price">{money(product.price * quantity)}</strong></article>)}</div><aside className="summary-panel"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>{money(getCartTotal())}</strong></div><div className="summary-line"><span>Campus pickup</span><strong className="free-label">Free</strong></div><div className="summary-total"><span>Total</span><strong>{money(getCartTotal())}</strong></div><p>Payment is handled at pickup, directly with the seller.</p><Link className="button button-primary full-button" to="/checkout">Continue to checkout <span>→</span></Link><Link className="summary-back" to="/shop">Continue browsing</Link></aside></div> : <EmptyState icon="0" title="Your cart is empty" description="Find a few campus essentials and they will be waiting here." action="Browse listings"/>}</PageShell>
}
function CheckoutPage() {
  const { cart, products, getCartTotal, clearCart, placeOrder } = useMarket()
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(null)
  const rows = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) })).filter((item) => item.product)
  const submitOrder = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const order = { buyerName: data.get('name'), pickupLocation: data.get('pickup'), paymentMethod: data.get('payment') }
    const total = placeOrder(order)
    clearCart()
    setPlaced({ ...order, total })
  }
  if (placed) return <PageShell><div className="confirmation"><div className="confirmation-mark">✓</div><span className="eyebrow">ORDER PLACED</span><h1>It is a deal.</h1><p>Thanks, {placed.buyerName}. Your sellers will be ready to meet at {placed.pickupLocation}.</p><div className="confirmation-total"><span>Order total</span><strong>{money(placed.total)}</strong></div><button className="button button-primary" onClick={() => navigate('/shop')}>Back to browsing</button></div></PageShell>
  if (!rows.length) return <PageShell><div className="page-heading"><div><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1></div></div><EmptyState icon="0" title="Your cart is empty" description="Add a campus find before checking out." action="Browse listings"/></PageShell>
  return <PageShell><div className="page-heading"><div><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1><p>One quick form, then coordinate your pickup.</p></div><div className="checkout-steps"><span className="step-done">1 Cart</span><i/> <strong>2 Details</strong><i/><span>3 Confirm</span></div></div><form className="checkout-layout" onSubmit={submitOrder}><div className="checkout-form"><section className="form-section"><span className="step-number">01</span><div><h2>Contact details</h2><p>So your sellers know who to look for.</p><label className="field-label">Full name<input className="field-control" name="name" defaultValue={CURRENT_USER.name} required/></label><label className="field-label">Campus email<input className="field-control" name="email" type="email" defaultValue={CURRENT_USER.email} required/></label></div></section><section className="form-section"><span className="step-number">02</span><div><h2>Pickup & payment</h2><p>Payment happens when you meet.</p><label className="field-label">Pickup location<select className="field-control" name="pickup" required><option>Library lobby</option><option>Student center</option><option>Main gate</option><option>Campus cafe</option></select></label><fieldset className="payment-options"><legend>Payment method</legend><label><input type="radio" name="payment" value="Cash on pickup" defaultChecked/> Cash on pickup</label><label><input type="radio" name="payment" value="GCash"/> GCash</label></fieldset></div></section></div><aside className="summary-panel checkout-summary"><h2>Your order</h2>{rows.map(({ product, quantity }) => <div className="checkout-item" key={product.id}><span>{product.title} × {quantity}</span><strong>{money(product.price * quantity)}</strong></div>)}<div className="summary-line"><span>Campus pickup</span><strong className="free-label">Free</strong></div><div className="summary-total"><span>Total</span><strong>{money(getCartTotal())}</strong></div><p>By placing your order, you agree to arrange pickup directly with each seller.</p><button className="button button-primary full-button" type="submit">Place order <span>→</span></button></aside></form></PageShell>
}
function SellPage() {
  const { addProduct } = useMarket()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const submitListing = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const price = Number(data.get('price'))
    if (!Number.isFinite(price) || price <= 0) { setError('Enter a price greater than zero.'); return }
    addProduct({ title: data.get('title'), category: data.get('category'), price, condition: data.get('condition'), description: data.get('description'), imageUrl: data.get('imageUrl') || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=85', courseCode: data.get('courseCode') })
    navigate('/my-listings')
  }
  return <PageShell><div className="page-heading"><div><span className="eyebrow">GIVE IT A NEW SEMESTER</span><h1>Sell an item</h1><p>Post a listing. Meet a neighbor. Clear some space.</p></div></div><form className="sell-layout" onSubmit={submitListing}><div className="sell-form"><label className="field-label">Listing title<input className="field-control" name="title" placeholder="e.g. Calculus, 8th Edition" required maxLength="80"/></label><div className="field-row"><label className="field-label">Category<select className="field-control" name="category" required>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Price (₱)<input className="field-control" name="price" type="number" min="1" step="1" placeholder="0" required/></label></div><fieldset className="condition-options"><legend>Condition</legend>{['New', 'Like New', 'Used'].map((item) => <label key={item}><input type="radio" name="condition" value={item} defaultChecked={item === 'Like New'}/>{item}</label>)}</fieldset><label className="field-label">Course code <span className="optional-label">Optional</span><input className="field-control" name="courseCode" placeholder="e.g. BIO 101" maxLength="24"/></label><label className="field-label">Description<textarea className="field-control" name="description" rows="4" placeholder="Describe the item, its condition, any useful details..." required maxLength="500"/></label><label className="field-label">Image URL <span className="optional-label">Optional</span><input className="field-control" name="imageUrl" type="url" placeholder="https://..."/></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><button className="button button-primary" type="submit">Post listing</button><button className="button button-outline" type="button" onClick={() => navigate(-1)}>Cancel</button></div></div><aside className="sell-tip"><span className="tip-icon">✳</span><h2>A good listing gets picked up.</h2><p>Clear photos and an honest description help campus buyers know exactly what they are getting.</p><div className="tip-rule"/><span>MEET LOCAL. PASS IT ON.</span></aside></form></PageShell>
}
function MyListingsPage() {
  const { products, updateProduct, deleteProduct } = useMarket()
  const [view, setView] = useState('Active')
  const mine = products.filter((product) => product.sellerId === CURRENT_USER.id)
  const filtered = mine.filter((product) => view === 'All' || (view === 'Active' ? !product.isSold : product.isSold))
  const editListing = (product) => {
    const title = window.prompt('Update listing title', product.title)
    if (title?.trim()) updateProduct(product.id, { title: title.trim() })
  }
  return <PageShell><div className="page-heading listings-heading"><div><span className="eyebrow">YOUR CAMPUS CORNER</span><h1>My listings</h1><p>{mine.length} listings · {mine.filter((item) => item.isSold).length} sold</p></div><Link className="button button-primary" to="/sell">＋ New listing</Link></div><div className="listing-tabs" role="tablist">{['All', 'Active', 'Sold'].map((item) => <button key={item} role="tab" aria-selected={view === item} className={view === item ? 'selected' : ''} onClick={() => setView(item)}>{item}<span>{item === 'All' ? mine.length : item === 'Active' ? mine.filter((product) => !product.isSold).length : mine.filter((product) => product.isSold).length}</span></button>)}</div>{filtered.length ? <div className="my-listings">{filtered.map((product) => <article className={`my-listing-row ${product.isSold ? 'is-sold' : ''}`} key={product.id}><Link to={`/product/${product.id}`} className="my-listing-image"><img src={product.imageUrl} alt=""/></Link><div className="my-listing-main"><span className="product-kicker">{product.category} · {product.condition}</span><Link to={`/product/${product.id}`} className="my-listing-name">{product.title}</Link><div className="my-listing-meta">{money(product.price)} <span>·</span> Posted {product.createdAt}</div></div><span className={`status-pill ${product.isSold ? 'sold' : 'active'}`}>{product.isSold ? 'Sold' : 'Active'}</span><div className="listing-actions"><button onClick={() => editListing(product)}>Edit</button>{!product.isSold && <button className="mark-sold" onClick={() => updateProduct(product.id, { isSold: true })}>Mark sold</button>}<button className="delete-listing" onClick={() => window.confirm(`Delete “${product.title}”?`) && deleteProduct(product.id)}>Delete</button></div></article>)}</div> : <EmptyState title={view === 'Sold' ? 'No sold items yet' : 'No listings just yet'} description="List something another student could use." action="Post your first listing" to="/sell"/>}</PageShell>
}
function App() { return <BrowserRouter><MarketProvider><Routes><Route path="/" element={<HomePage/>}/><Route path="/shop" element={<ShopPage/>}/><Route path="/product/:id" element={<ProductDetailPage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/sell" element={<SellPage/>}/><Route path="/my-listings" element={<MyListingsPage/>}/><Route path="*" element={<PageShell><EmptyState icon="?" title="Page not found" description="That campus corner does not exist." action="Go home" to="/"/></PageShell>}/></Routes></MarketProvider></BrowserRouter> }

export default App

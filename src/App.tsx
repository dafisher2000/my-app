import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  color: string;
  sizes: number[];
  emoji: string;
};

type CartItem = { product: Product; size: number; qty: number };

const PRODUCTS: Product[] = [
  { id: 1, name: "Aero Runner", brand: "Velocity", price: 129, color: "#2563eb", sizes: [8, 9, 10, 11], emoji: "👟" },
  { id: 2, name: "Court Classic", brand: "Legacy", price: 89, color: "#111827", sizes: [7, 8, 9, 10, 11], emoji: "👟" },
  { id: 3, name: "Trail Blazer", brand: "Summit", price: 149, color: "#16a34a", sizes: [9, 10, 11, 12], emoji: "🥾" },
  { id: 4, name: "Cloud Walk", brand: "Softstep", price: 99, color: "#f59e0b", sizes: [6, 7, 8, 9], emoji: "👟" },
  { id: 5, name: "Sprint Pro", brand: "Velocity", price: 179, color: "#dc2626", sizes: [8, 9, 10], emoji: "👟" },
  { id: 6, name: "Urban High", brand: "Street", price: 119, color: "#7c3aed", sizes: [7, 8, 9, 10, 11], emoji: "🥾" },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);

  function addToCart(product: Product, size: number) {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id && i.size === size);
      if (found) {
        return prev.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, size, qty: 1 }];
    });
    setToast(`${product.name} (size ${size}) added to cart`);
    setTimeout(() => setToast(null), 2000);
  }

  function changeQty(index: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i, idx) => (idx === index ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  }

  return (
    <div className="store">
      <header className="header">
        <span className="logo">🥿 Shoe&Co</span>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart{count > 0 && <span className="badge">{count}</span>}
        </button>
      </header>

      <section className="hero">
        <h1>Step into something new</h1>
        <p>Quality footwear for every stride — running, court, trail and street.</p>
      </section>

      <main className="grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </main>

      <footer className="footer">Free shipping over $100 · 30-day returns</footer>

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart" onClick={(e) => e.stopPropagation()}>
            <div className="cart-head">
              <h2>Your cart</h2>
              <button className="close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="empty">Your cart is empty. Pick a pair!</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map((item, idx) => (
                    <li key={`${item.product.id}-${item.size}`}>
                      <span className="cart-emoji" style={{ background: item.product.color + "22" }}>
                        {item.product.emoji}
                      </span>
                      <div className="cart-info">
                        <strong>{item.product.name}</strong>
                        <small>Size {item.size} · ${item.product.price}</small>
                      </div>
                      <div className="qty">
                        <button onClick={() => changeQty(idx, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(idx, 1)}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-foot">
                  <div className="total">
                    <span>Total</span>
                    <strong>${total}</strong>
                  </div>
                  <button className="checkout">Checkout</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product, size: number) => void }) {
  const [size, setSize] = useState<number | null>(null);

  return (
    <article className="card">
      <div className="thumb" style={{ background: product.color + "1a" }}>
        <span style={{ fontSize: 64 }}>{product.emoji}</span>
        <span className="brand">{product.brand}</span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3>{product.name}</h3>
          <span className="price">${product.price}</span>
        </div>
        <div className="sizes">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={size === s ? "size selected" : "size"}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          className="add"
          disabled={size === null}
          onClick={() => size !== null && onAdd(product, size)}
        >
          {size === null ? "Select a size" : `Add size ${size} to cart`}
        </button>
      </div>
    </article>
  );
}

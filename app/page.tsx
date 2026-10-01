import Link from "next/link";

const features = [
  {
    icon: "🚚",
    title: "Fast Delivery",
    description: "Quick and reliable delivery right to your doorstep.",
  },
  {
    icon: "🔒",
    title: "Secure Shopping",
    description: "Shop confidently with a safe and simple experience.",
  },
  {
    icon: "✨",
    title: "Quality Products",
    description: "Carefully selected products made for everyday life.",
  },
  {
    icon: "💳",
    title: "Easy Checkout",
    description: "A smooth checkout process with no unnecessary steps.",
  },
];

const highlights = [
  "Curated products",
  "Simple shopping",
  "Secure checkout",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background glow */}
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
                Welcome to MiniShop
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Shop smarter.
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Live better.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg lg:mx-0">
                Discover carefully selected products, explore useful
                categories, and enjoy a clean shopping experience built
                around you.
              </p>

              {/* Highlights */}
              <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-slate-300 lg:justify-start">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Shop Now
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

<Link
  href="/categories"
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
>
  Explore Categories →
</Link>


              </div>

              {/* Small stats */}
              <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-white/10 pt-7 text-left">
                <Stat value="100%" label="Simple" />
                <Stat value="24/7" label="Shopping" />
                <Stat value="Easy" label="Checkout" />
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto hidden h-[500px] w-full max-w-[500px] lg:block">
              {/* Outer glow */}
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />

              {/* Rotating decorative ring */}
              <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20" />

              <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/20" />

              {/* Main card */}
              <div className="absolute left-1/2 top-1/2 flex h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-2 flex-col items-center justify-center rounded-[2.5rem] border border-white/20 bg-white shadow-2xl shadow-blue-950/50">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 text-5xl shadow-xl shadow-blue-500/30">
                  🛍️
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900">
                  MiniShop
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Shop smarter. Shop better.
                </p>

                <div className="mt-5 flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                </div>
              </div>

              {/* Floating card - top */}
              <div className="absolute right-0 top-10 rounded-2xl border border-white/10 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                    ✨
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Quality Products
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Carefully selected
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card - bottom */}
              <div className="absolute bottom-12 left-0 rounded-2xl border border-white/10 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-lg">
                    ⚡
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Easy Shopping
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Fast & simple
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-20 right-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-blue-600 text-center text-xs font-bold text-white shadow-xl shadow-blue-600/30">
                SHOP
                <br />
                NOW
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Why MiniShop
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Everything made simple.
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            From discovering products to completing your order, every part of
            the experience is designed to feel simple and effortless.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Shopping CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-7 py-14 shadow-2xl shadow-blue-900/20 sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Start Shopping
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Your next favorite product is waiting.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
              Explore our collection and find products that fit your everyday
              needs.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
            >
              Browse Products
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
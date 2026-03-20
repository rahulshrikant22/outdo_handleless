import { Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ArrowRight, Star, Shield, Truck, Phone } from "lucide-react";

const features = [
  { icon: <Shield size={24} />, title: "Premium Quality", desc: "E1-grade MDF with automotive-level finishes" },
  { icon: <Star size={24} />, title: "Design Excellence", desc: "Sleek handleless profiles for modern aesthetics" },
  { icon: <Truck size={24} />, title: "Pan-India Delivery", desc: "Factory-direct delivery to all major cities" },
  { icon: <Phone size={24} />, title: "Expert Support", desc: "Dedicated design and installation guidance" },
];

const products = [
  {
    title: "Kitchen Shutters",
    desc: "Sleek, modern handleless shutters for modular kitchens with soft-close mechanism.",
    image: "https://images.unsplash.com/photo-1738162599555-c28b00062960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoYW5kbGVsZXNzJTIwa2l0Y2hlbiUyMGNhYmluZXRzJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczNjk0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "From ₹15,000/unit",
  },
  {
    title: "Wardrobe Systems",
    desc: "Premium handleless wardrobe doors with soft-close, available in all finishes.",
    image: "https://images.unsplash.com/photo-1765766600589-ddad380d6534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJkcm9iZSUyMGNsb3NldCUyMGRvb3JzfGVufDF8fHx8MTc3MzY5NDU5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "From ₹18,000/unit",
  },
  {
    title: "Office Partitions",
    desc: "Durable partition panels for commercial spaces with clean, professional look.",
    image: "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvciUyMHBhcnRpdGlvbnxlbnwxfHx8fDE3NzM2OTQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "From ₹12,000/unit",
  },
];

export function PublicHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold mb-4 sm:mb-6" style={{ fontSize: 13, fontWeight: 500 }}>
              <Star size={14} /> Premium Handleless Solutions
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15, color: "white" }} className="sm:!text-[42px]">
              Redefine Your Space with Handleless Shutters
            </h1>
            <p className="text-white/70 mt-4 max-w-lg" style={{ fontSize: 16, lineHeight: 1.6 }}>
              Factory-crafted, design-forward handleless shutters for kitchens, wardrobes, and commercial spaces. Experience seamless elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 sm:mt-8">
              <Link
                to="/public/quote"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gold text-navy hover:bg-gold-light transition-colors"
                style={{ fontSize: 15, fontWeight: 600 }}
              >
                Get a Quote <ArrowRight size={18} />
              </Link>
              <Link
                to="/public/products"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/8 transition-colors"
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold-dark shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{f.title}</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Our Product Range</h2>
            <p className="text-muted-foreground mt-2" style={{ fontSize: 15 }}>
              Designed for modern living, crafted for lasting performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.title}
                to="/public/products"
                className="group rounded-xl border border-border overflow-hidden bg-background hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p style={{ fontSize: 17, fontWeight: 600 }}>{p.title}</p>
                  <p className="text-muted-foreground mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{p.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <span className="text-gold-dark" style={{ fontSize: 14, fontWeight: 600 }}>{p.price}</span>
                    <span className="text-muted-foreground group-hover:text-gold-dark transition-colors flex items-center gap-1" style={{ fontSize: 13 }}>
                      Learn more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>Ready to Transform Your Space?</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto" style={{ fontSize: 15, lineHeight: 1.6 }}>
            Whether you are a homeowner, dealer, architect, or builder — we have the right handleless shutter solution for you.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              to="/public/quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors"
              style={{ fontSize: 15, fontWeight: 600 }}
            >
              Request a Quote
            </Link>
            <Link
              to="/public/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
              style={{ fontSize: 15, fontWeight: 500 }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
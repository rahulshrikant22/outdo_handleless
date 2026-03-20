import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { products } from "../../data";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";

const productImages: Record<string, string> = {
  PR01: "https://images.unsplash.com/photo-1738162599555-c28b00062960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoYW5kbGVsZXNzJTIwa2l0Y2hlbiUyMGNhYmluZXRzJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczNjk0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  PR02: "https://images.unsplash.com/photo-1765766600589-ddad380d6534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJkcm9iZSUyMGNsb3NldCUyMGRvb3JzfGVufDF8fHx8MTc3MzY5NDU5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  PR03: "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvciUyMHBhcnRpdGlvbnxlbnwxfHx8fDE3NzM2OTQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  PR04: "https://images.unsplash.com/photo-1763485957127-5645e9348426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMHZhbml0eSUyMG1vZGVybnxlbnwxfHx8fDE3NzM2NTQ5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

const finishes = ["Super Matte", "High Gloss", "Woodgrain", "Textured"];

const features = [
  "Handleless J-Pull / Gola profiles",
  "Soft-close hardware included",
  "E1 / E0 grade MDF core",
  "Moisture-resistant options",
  "Custom dimensions available",
  "10-year warranty on hardware",
];

export function PublicProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      {/* Header */}
      <section className="bg-navy text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "white" }}>Our Products</h1>
          <p className="text-white/60 mt-2" style={{ fontSize: 16 }}>
            Premium handleless shutter solutions for every space
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? "bg-navy text-white"
                  : "bg-card border border-border text-foreground hover:bg-accent"
              }`}
              style={{ fontSize: 13.5, fontWeight: 500 }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8">
            {filtered.map((product) => (
              <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="h-64 md:h-auto overflow-hidden">
                    <ImageWithFallback
                      src={productImages[product.id]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="inline-flex self-start px-3 py-1 rounded-full bg-gold/10 text-gold-dark mb-3" style={{ fontSize: 12, fontWeight: 500 }}>
                      {product.category}
                    </span>
                    <h3 style={{ fontSize: 22, fontWeight: 600 }}>{product.name}</h3>
                    <p className="text-muted-foreground mt-2" style={{ fontSize: 14, lineHeight: 1.6 }}>
                      {product.description}
                    </p>
                    <p className="text-navy mt-3" style={{ fontSize: 18, fontWeight: 700 }}>{product.priceRange}</p>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Available Finishes:</p>
                      <div className="flex gap-2">
                        {finishes.map((f) => (
                          <span key={f} className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontSize: 12 }}>{f}</span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/public/quote"
                      className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors self-start"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      Get a Quote <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h3 className="mb-6" style={{ fontSize: 20, fontWeight: 600 }}>Why Choose OutDo Shutters?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border">
                <Check size={18} className="text-gold shrink-0" />
                <span style={{ fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
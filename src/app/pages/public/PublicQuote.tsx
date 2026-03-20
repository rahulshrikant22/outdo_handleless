import { useState } from "react";
import { Link } from "react-router";
import { products } from "../../data";
import { FileText, ArrowRight, CheckCircle2, Shield, Lock } from "lucide-react";

export function PublicQuote() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    product: "", quantity: "", finish: "", width: "", height: "",
    name: "", email: "", phone: "", city: "", notes: "",
  });

  const updateField = (key: string, value: string) => setFormData({ ...formData, [key]: value });

  return (
    <div>
      {/* Header */}
      <section className="bg-navy text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "white" }}>Request a Quote</h1>
          <p className="text-white/60 mt-2" style={{ fontSize: 16 }}>
            Tell us about your project and we will prepare a detailed quotation
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? "bg-navy text-white" : "bg-muted text-muted-foreground"
                }`} style={{ fontSize: 13, fontWeight: 600 }}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <span className={step >= s ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: 13, fontWeight: 500 }}>
                  {s === 1 ? "Product" : s === 2 ? "Dimensions" : "Contact"}
                </span>
                {s < 3 && <div className={`w-12 h-px ${step > s ? "bg-navy" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>Select Product</h3>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Product Type</label>
                  <select
                    value={formData.product}
                    onChange={(e) => updateField("product", e.target.value)}
                    className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    style={{ fontSize: 14 }}
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.priceRange}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Quantity (units)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={formData.quantity}
                    onChange={(e) => updateField("quantity", e.target.value)}
                    className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Preferred Finish</label>
                  <select
                    value={formData.finish}
                    onChange={(e) => updateField("finish", e.target.value)}
                    className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    style={{ fontSize: 14 }}
                  >
                    <option value="">Select finish</option>
                    <option value="super_matte">Super Matte</option>
                    <option value="high_gloss">High Gloss</option>
                    <option value="woodgrain">Woodgrain</option>
                    <option value="textured">Textured</option>
                  </select>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  Next: Dimensions <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Width (mm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 600"
                      value={formData.width}
                      onChange={(e) => updateField("width", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Height (mm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 720"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Additional Notes</label>
                  <textarea
                    placeholder="Any special requirements, custom dimensions, etc."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
                    style={{ fontSize: 15, fontWeight: 500 }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: 15, fontWeight: 600 }}
                  >
                    Next: Contact <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>Your Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Phone</label>
                    <input
                      type="tel"
                      placeholder="+91-XXXXX-XXXXX"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>City</label>
                    <input
                      type="text"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gold/8 border border-gold/20 flex items-start gap-3">
                  <Shield size={18} className="text-gold-dark shrink-0 mt-0.5" />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>Your information is secure</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>We will use your details only to prepare and send your quotation.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
                    style={{ fontSize: 15, fontWeight: 500 }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-3 rounded-xl bg-gold text-navy hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: 15, fontWeight: 600 }}
                  >
                    <FileText size={16} /> Submit Request
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600 }}>Quote Request Submitted!</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto" style={{ fontSize: 14 }}>
                  Thank you for your interest. Our team will prepare a detailed quotation and reach out within 24 hours.
                </p>
                <div className="flex gap-3 justify-center mt-6">
                  <Link
                    to="/public"
                    className="px-5 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors"
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    Back to Home
                  </Link>
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors flex items-center gap-2"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    <Lock size={14} /> Login to Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
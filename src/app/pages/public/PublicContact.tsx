import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export function PublicContact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  return (
    <div>
      {/* Header */}
      <section className="bg-navy text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "white" }}>Contact Us</h1>
          <p className="text-white/60 mt-2" style={{ fontSize: 16 }}>
            Get in touch with our team for inquiries, support, or partnership opportunities
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <MapPin size={20} />, title: "Head Office", lines: ["OutDo Handleless Shutters", "12, Industrial Estate", "Andheri East, Mumbai 400093"] },
              { icon: <Phone size={20} />, title: "Phone", lines: ["+91-22-12345678", "+91-98765-43210 (Sales)"] },
              { icon: <Mail size={20} />, title: "Email", lines: ["info@outdo.in", "sales@outdo.in"] },
              { icon: <Clock size={20} />, title: "Working Hours", lines: ["Mon-Sat: 9:00 AM - 6:00 PM", "Sun: Closed"] },
            ].map((info) => (
              <div key={info.title} className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{info.title}</p>
                  {info.lines.map((line, i) => (
                    <p key={i} className="text-muted-foreground" style={{ fontSize: 13 }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Regional Offices */}
            <div className="p-5 bg-card rounded-xl border border-border">
              <p style={{ fontSize: 14, fontWeight: 600 }} className="mb-3">Regional Offices</p>
              {["Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Pune"].map((city) => (
                <div key={city} className="flex items-center gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-8">
            <h3 style={{ fontSize: 20, fontWeight: 600 }} className="mb-6">Send Us a Message</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 w-full px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Message</label>
                <textarea
                  placeholder="Tell us about your project or inquiry..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                  style={{ fontSize: 14 }}
                />
              </div>
              <button 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-white hover:bg-navy-light transition-colors" 
                style={{ fontSize: 15, fontWeight: 600 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (!formData.name || !formData.email || !formData.message) {
                    toast.error("Please fill all fields", { description: "Name, email, and message are required." });
                    return;
                  }
                  toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
                  setFormData({ name: "", email: "", phone: "", message: "" });
                }}
              >
                <Send size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
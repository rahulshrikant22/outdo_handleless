import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import { TabBar, SummaryCard, Button, Drawer, DetailField, Chip } from "../../components/shared";
import { BookOpen, Palette, Ruler, Layers } from "lucide-react";
import { toast } from "sonner";

const materials = [
  { id: "M01", name: "MDF Board — 18mm", category: "Core", finish: "Raw", dimensions: "2440 x 1220mm", grade: "E1", available: true },
  { id: "M02", name: "HDF Board — 12mm", category: "Core", finish: "Raw", dimensions: "2440 x 1220mm", grade: "E0", available: true },
  { id: "M03", name: "Acrylic Laminate — Glossy White", category: "Surface", finish: "High Gloss", dimensions: "Custom", grade: "Premium", available: true },
  { id: "M04", name: "PU Paint — Matte", category: "Surface", finish: "Matte", dimensions: "N/A", grade: "Automotive", available: true },
  { id: "M05", name: "Soft-Close Hinge — Full Overlay", category: "Hardware", finish: "Nickel", dimensions: "110°", grade: "Heavy Duty", available: true },
  { id: "M06", name: "Aluminum Profile — J-Pull", category: "Hardware", finish: "Anodized", dimensions: "3000mm", grade: "Standard", available: false },
];

const finishes = [
  { name: "Super Matte", code: "SM", colors: ["#2C3E50", "#ECF0F1", "#95A5A6", "#F09088", "#E74C3C"] },
  { name: "High Gloss", code: "HG", colors: ["#FFFFFF", "#1B2A4A", "#EC6E63", "#34495E", "#2ECC71"] },
  { name: "Woodgrain", code: "WG", colors: ["#8B6914", "#A0522D", "#DEB887", "#D2691E", "#F5DEB3"] },
  { name: "Textured", code: "TX", colors: ["#BDC3C7", "#7F8C8D", "#2C3E50", "#ECF0F1", "#AAB7B8"] },
];

export function ArchitectSpecifications() {
  const [activeTab, setActiveTab] = useState("materials");
  const [selectedMaterial, setSelectedMaterial] = useState<typeof materials[0] | null>(null);

  return (
    <PageShell title="Specifications" subtitle="Material library and design specifications">
      <TabBar
        tabs={[
          { key: "materials", label: "Materials" },
          { key: "finishes", label: "Finishes" },
          { key: "dimensions", label: "Dimension Guide" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === "materials" && (
          <div className="space-y-3">
            {materials.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMaterial(m)}
                className="bg-card rounded-xl border border-border p-4 hover:border-violet-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Layers size={16} className="text-violet-600" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Chip label={m.category} color="default" />
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>{m.dimensions}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Chip label={m.grade} color="navy" />
                  <p className={`mt-1 ${m.available ? "text-emerald-600" : "text-red-500"}`} style={{ fontSize: 11.5, fontWeight: 500 }}>
                    {m.available ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "finishes" && (
          <div className="grid gap-4 md:grid-cols-2">
            {finishes.map((f) => (
              <SummaryCard key={f.code} title={f.name}>
                <p className="text-muted-foreground mb-3" style={{ fontSize: 12 }}>Code: {f.code}</p>
                <div className="flex gap-2">
                  {f.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg border border-border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </SummaryCard>
            ))}
          </div>
        )}

        {activeTab === "dimensions" && (
          <div className="space-y-4">
            {[
              { type: "Kitchen Base Unit", standard: "600-900mm W × 580mm D × 720mm H", note: "Standard depth includes door thickness" },
              { type: "Kitchen Wall Unit", standard: "300-900mm W × 330mm D × 720mm H", note: "Height varies by design" },
              { type: "Wardrobe Module", standard: "450-600mm W × 580mm D × 2100mm H", note: "Full height including plinth" },
              { type: "Office Partition", standard: "800-1200mm W × 50mm D × 1200-2400mm H", note: "Custom heights available" },
            ].map((dim) => (
              <div key={dim.type} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Ruler size={18} className="text-violet-600" />
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{dim.type}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p style={{ fontSize: 14, fontWeight: 500, fontFamily: "monospace" }}>{dim.standard}</p>
                </div>
                <p className="text-muted-foreground mt-2" style={{ fontSize: 12.5 }}>{dim.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer open={!!selectedMaterial} onClose={() => setSelectedMaterial(null)} title={selectedMaterial?.name || ""}>
        {selectedMaterial && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <Layers size={20} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selectedMaterial.name}</p>
                <Chip label={selectedMaterial.category} color="default" />
              </div>
            </div>

            <SummaryCard title="Specifications">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Category" value={selectedMaterial.category} />
                <DetailField label="Finish" value={selectedMaterial.finish} />
                <DetailField label="Dimensions" value={selectedMaterial.dimensions} />
                <DetailField label="Grade" value={selectedMaterial.grade} />
                <DetailField label="Availability" value={selectedMaterial.available ? "In Stock" : "Out of Stock"} />
                <DetailField label="ID" value={selectedMaterial.id} />
              </div>
            </SummaryCard>

            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Added to project", { description: `${selectedMaterial.name} has been added to your project specification.` })}>Add to Project</Button>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
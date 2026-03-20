import { useState, useEffect } from "react";
import { Modal, Button, InputField, SelectField, DateField } from "../shared";
import {
  pricingCategories, pricingItemTypes, pricingUnits, pricingStatuses,
  formatPricingUnit, formatItemType,
  type PricingItem, type PricingUnit, type PricingItemType, type PricingStatus,
} from "../../data/pricing";
import type { ProjectCategory } from "../../data/orders";
import { Save, Plus } from "lucide-react";

interface PricingFormModalProps {
  open: boolean;
  onClose: () => void;
  editItem?: PricingItem | null;
}

export function PricingFormModal({ open, onClose, editItem }: PricingFormModalProps) {
  const isEdit = !!editItem;

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [itemType, setItemType] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [rate, setRate] = useState("");
  const [minQty, setMinQty] = useState("1");
  const [status, setStatus] = useState<string>("active");
  const [effectiveFrom, setEffectiveFrom] = useState("2026-04-01");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [description, setDescription] = useState("");
  const [dimLength, setDimLength] = useState("");
  const [dimHeight, setDimHeight] = useState("");
  const [dimThickness, setDimThickness] = useState("");
  const [tags, setTags] = useState("");
  const [rateChangeReason, setRateChangeReason] = useState("");

  useEffect(() => {
    if (editItem) {
      setItemName(editItem.itemName);
      setCategory(editItem.category);
      setItemType(editItem.itemType);
      setUnit(editItem.unit);
      setRate(editItem.rate.toString());
      setMinQty(editItem.minOrderQty.toString());
      setStatus(editItem.status);
      setEffectiveFrom(editItem.effectiveFrom);
      setEffectiveTo(editItem.effectiveTo || "");
      setDescription(editItem.description);
      setDimLength(editItem.dimensions?.length?.toString() || "");
      setDimHeight(editItem.dimensions?.height?.toString() || "");
      setDimThickness(editItem.dimensions?.thickness?.toString() || "");
      setTags(editItem.tags.join(", "));
      setRateChangeReason("");
    } else {
      resetForm();
    }
  }, [editItem, open]);

  const resetForm = () => {
    setItemName(""); setCategory(""); setItemType(""); setUnit("");
    setRate(""); setMinQty("1"); setStatus("active");
    setEffectiveFrom("2026-04-01"); setEffectiveTo("");
    setDescription(""); setDimLength(""); setDimHeight(""); setDimThickness("");
    setTags(""); setRateChangeReason("");
  };

  const handleSubmit = () => {
    // In real app, would save to backend
    onClose();
  };

  const showRateChange = isEdit && editItem && rate !== editItem.rate.toString();

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Edit: ${editItem?.itemName}` : "Add New Pricing Item"} size="lg">
      <div className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputField label="Item Name" placeholder="e.g., Base Cabinet Shutter - 600mm" value={itemName} onChange={setItemName} />
          </div>
          <SelectField
            label="Category"
            placeholder="Select category..."
            options={pricingCategories.map(c => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c }))}
            value={category}
            onChange={setCategory}
          />
          <SelectField
            label="Item Type"
            placeholder="Select type..."
            options={pricingItemTypes.map(t => ({ label: formatItemType(t), value: t }))}
            value={itemType}
            onChange={setItemType}
          />
          <SelectField
            label="Unit"
            placeholder="Select unit..."
            options={pricingUnits.map(u => ({ label: formatPricingUnit(u), value: u }))}
            value={unit}
            onChange={setUnit}
          />
          <InputField label="Rate (₹)" placeholder="e.g., 4200" value={rate} onChange={setRate} type="number" />
          <InputField label="Min Order Qty" placeholder="1" value={minQty} onChange={setMinQty} type="number" />
          <SelectField
            label="Status"
            placeholder="Select status..."
            options={pricingStatuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
            value={status}
            onChange={setStatus}
          />
        </div>

        {/* Rate Change Reason (edit mode) */}
        {showRateChange && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-amber-800" style={{ fontSize: 13, fontWeight: 500 }}>
              Rate changed: ₹{editItem!.rate.toLocaleString("en-IN")} → ₹{Number(rate).toLocaleString("en-IN")}
            </p>
            <div className="mt-2">
              <label className="block mb-1.5 text-amber-800" style={{ fontSize: 12, fontWeight: 500 }}>Reason for change</label>
              <input
                value={rateChangeReason}
                onChange={(e) => setRateChangeReason(e.target.value)}
                placeholder="e.g., Material cost increase..."
                className="h-9 w-full px-3 rounded-lg bg-white border border-amber-300 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>
        )}

        {/* Effective Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField label="Effective From" value={effectiveFrom} onChange={setEffectiveFrom} />
          <DateField label="Effective To (optional)" value={effectiveTo} onChange={setEffectiveTo} />
        </div>

        {/* Dimensions */}
        <div>
          <p className="text-foreground mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Dimensions (optional)</p>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Length (mm)" placeholder="600" value={dimLength} onChange={setDimLength} type="number" />
            <InputField label="Height (mm)" placeholder="720" value={dimHeight} onChange={setDimHeight} type="number" />
            <InputField label="Thickness (mm)" placeholder="18" value={dimThickness} onChange={setDimThickness} type="number" />
          </div>
        </div>

        {/* Description & Tags */}
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description and specifications..."
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <InputField label="Tags (comma-separated)" placeholder="kitchen, base, 600mm, standard" value={tags} onChange={setTags} />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="gold" size="sm" className="flex-1" icon={isEdit ? <Save size={14} /> : <Plus size={14} />} onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Pricing Item"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

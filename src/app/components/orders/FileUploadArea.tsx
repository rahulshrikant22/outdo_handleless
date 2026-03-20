import { StatusBadge, Button } from "../shared";
import type { OrderFile } from "../../data/orders";
import { Upload, FileText, Image, FileSpreadsheet, Pencil, File, Download, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const fileTypeIcons: Record<string, React.ReactNode> = {
  cad: <Pencil size={18} className="text-blue-600" />,
  pdf: <FileText size={18} className="text-red-500" />,
  sketch: <Image size={18} className="text-amber-600" />,
  image: <Image size={18} className="text-emerald-600" />,
  excel: <FileSpreadsheet size={18} className="text-green-600" />,
  other: <File size={18} className="text-gray-500" />,
};

const fileTypeBg: Record<string, string> = {
  cad: "bg-blue-50", pdf: "bg-red-50", sketch: "bg-amber-50",
  image: "bg-emerald-50", excel: "bg-green-50", other: "bg-gray-50",
};

interface FileUploadAreaProps {
  files: OrderFile[];
  showUpload?: boolean;
}

export function FileUploadArea({ files, showUpload = true }: FileUploadAreaProps) {
  return (
    <div className="space-y-4">
      {/* File cards */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background hover:border-gold/30 transition-colors">
              <div className={`w-10 h-10 rounded-lg ${fileTypeBg[file.type]} flex items-center justify-center shrink-0`}>
                {fileTypeIcons[file.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{file.size}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>·</span>
                  <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{file.uploadedAt}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {file.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontSize: 10.5 }}>{tag}</span>
                  ))}
                  {file.drawingStatus && (
                    <StatusBadge status={file.drawingStatus} size="xs" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground" onClick={() => toast.info("Opening preview...", { description: file.name })}>
                  <Eye size={13} />
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground" onClick={() => toast.success("Downloading...", { description: file.name })}>
                  <Download size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {showUpload && (
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-gold/40 transition-colors cursor-pointer">
          <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
          <p style={{ fontSize: 14, fontWeight: 500 }}>Drop files here or click to upload</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: 12.5 }}>
            Supports CAD (.dwg, .dxf), PDF, Images, Excel, Hand sketches
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => toast.info("File browser opened", { description: "Select files to upload." })}>Browse Files</Button>
          </div>
        </div>
      )}
    </div>
  );
}
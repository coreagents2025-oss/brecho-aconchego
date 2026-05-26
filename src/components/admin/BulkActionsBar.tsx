import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Trash2, X } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onStatus: (status: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({ count, onClear, onStatus, onDuplicate, onDelete }: Props) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
      <span className="text-sm font-medium">{count} selecionado(s)</span>
      <Select onValueChange={onStatus}>
        <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Mudar status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Disponível">Disponível</SelectItem>
          <SelectItem value="Reservado">Reservado</SelectItem>
          <SelectItem value="Vendido">Vendido</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={onDuplicate}>
        <Copy /> Duplicar
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash2 /> Excluir
      </Button>
      <Button variant="ghost" size="icon" onClick={onClear}>
        <X />
      </Button>
    </div>
  );
}

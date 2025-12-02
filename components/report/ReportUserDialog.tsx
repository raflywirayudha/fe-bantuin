"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TbFlag, TbLoader, TbAlertTriangle } from "react-icons/tb";

interface ReportUserDialogProps {
  reportedUserId: string;
  reportedUserName: string;
  trigger?: React.ReactNode; // Tombol pemicu custom
}

export const ReportUserDialog = ({
  reportedUserId,
  reportedUserName,
  trigger,
}: ReportUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!reason || !description) return alert("Mohon lengkapi formulir");

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportedUserId,
          reason,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          "Laporan terkirim. Terima kasih telah menjaga keamanan komunitas."
        );
        setOpen(false);
        setReason("");
        setDescription("");
      } else {
        alert(data.message || "Gagal mengirim laporan");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
            title="Laporkan Pengguna"
          >
            <TbFlag className="w-5 h-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <TbAlertTriangle className="w-5 h-5" />
            Laporkan {reportedUserName}
          </DialogTitle>
          <DialogDescription>
            Laporan Anda bersifat anonim dan akan ditinjau oleh admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Alasan Pelaporan</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pelanggaran..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spam">Spam / Iklan Mengganggu</SelectItem>
                <SelectItem value="Penipuan">Indikasi Penipuan</SelectItem>
                <SelectItem value="Pelecehan">
                  Kata-kata Kasar / Pelecehan
                </SelectItem>
                <SelectItem value="Identitas Palsu">Identitas Palsu</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Detail Kejadian</Label>
            <Textarea
              placeholder="Ceritakan detail masalahnya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !reason || description.length < 10}
          >
            {loading ? (
              <TbLoader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Kirim Laporan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

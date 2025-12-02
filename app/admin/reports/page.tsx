"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TbFlag,
  TbCheck,
  TbX,
  TbLoader,
  TbAlertTriangle,
  TbArrowRight,
} from "react-icons/tb";

interface Report {
  id: string;
  reason: string;
  description: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  reporter: {
    fullName: string;
    email: string;
  };
  reportedUser: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    if (!confirm(`Ubah status laporan menjadi ${status}?`)) return;

    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchReports();
    } catch (error) {
      alert("Gagal memproses");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <TbFlag className="text-red-600" /> Laporan Pelanggaran
            </h1>
            <p className="text-muted-foreground text-sm">
              Daftar laporan user yang perlu ditinjau
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <TbLoader className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <TbCheck className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-lg font-medium">Semua Aman!</h3>
              <p className="text-muted-foreground">
                Tidak ada laporan pelanggaran saat ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <div
                  className={`h-1 w-full ${
                    report.status === "OPEN"
                      ? "bg-red-500"
                      : report.status === "RESOLVED"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Info Pelapor & Terlapor */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="flex flex-col items-center text-center gap-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={report.reportedUser.profilePicture || ""}
                          />
                          <AvatarFallback className="bg-red-100 text-red-600">
                            !
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {report.reportedUser.fullName}
                          </p>
                          <Badge variant="outline" className="text-[10px]">
                            Terlapor
                          </Badge>
                        </div>
                      </div>

                      <TbArrowRight className="text-muted-foreground h-5 w-5" />

                      <div className="text-sm text-muted-foreground">
                        <p className="text-xs mb-1">Pelapor:</p>
                        <p className="font-medium text-foreground">
                          {report.reporter.fullName}
                        </p>
                        <p className="text-xs">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Detail Masalah */}
                    <div className="flex-1 bg-muted/30 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-red-700 flex items-center gap-2">
                          <TbAlertTriangle className="h-4 w-4" />
                          {report.reason}
                        </h3>
                        <Badge
                          variant={
                            report.status === "OPEN"
                              ? "destructive"
                              : report.status === "RESOLVED"
                              ? "default" // hijau (biasanya default di shadcn)
                              : "secondary"
                          }
                        >
                          {report.status === "RESOLVED"
                            ? "SELESAI"
                            : report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        "{report.description}"
                      </p>
                    </div>

                    {/* Aksi */}
                    {report.status === "OPEN" && (
                      <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                        <Button
                          size="sm"
                          onClick={() => handleAction(report.id, "RESOLVED")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <TbCheck className="mr-2 h-4 w-4" /> Selesaikan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(report.id, "DISMISSED")}
                        >
                          <TbX className="mr-2 h-4 w-4" /> Abaikan
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

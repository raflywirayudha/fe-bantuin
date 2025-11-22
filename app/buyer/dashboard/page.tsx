"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TbShoppingCart,
  TbCheck,
  TbClock,
  TbSearch,
  TbTrendingUp,
} from "react-icons/tb";
import Link from "next/link";

const BuyerDashboardPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        fetchBuyerStats();
      }
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchBuyerStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      // Ambil semua order user ini
      const response = await fetch("/api/orders?role=buyer&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        const orders: any[] = data.data;

        // Hitung statistik manual di client
        const active = orders.filter((o) =>
          ["PAID_ESCROW", "IN_PROGRESS", "DELIVERED", "REVISION"].includes(
            o.status
          )
        ).length;

        const completed = orders.filter((o) => o.status === "COMPLETED").length;

        const spent = orders
          .filter((o) => o.status === "COMPLETED")
          .reduce((sum, o) => sum + Number(o.price), 0);

        setStats({
          activeOrders: active,
          completedOrders: completed,
          totalSpent: spent,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </BuyerLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Dashboard Pembeli
            </h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, {user?.fullName}!
            </p>
          </div>
          <Link href="/services">
            <Button>
              <TbSearch className="mr-2" /> Cari Jasa Baru
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pesanan Aktif
                </CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TbClock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.activeOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sedang diproses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pesanan Selesai
                </CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <TbCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.completedOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Riwayat sukses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pengeluaran
                </CardTitle>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <TbTrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Investasi produktif
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TbShoppingCart className="mx-auto text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                Lihat detail pesananmu
              </p>
              <Link href="/buyer/orders">
                <Button variant="link" className="mt-2">
                  Ke Halaman Pesanan &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
};

export default BuyerDashboardPage;

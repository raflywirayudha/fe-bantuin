"use client";

import BuyerLayout from "@/components/layouts/BuyerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function BuyerSettingsPage() {
  const { user } = useAuth();

  return (
    <BuyerLayout>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Lengkap
            </label>
            <p className="text-lg">{user?.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm">
            Fitur edit profil lengkap akan segera hadir.
          </div>
        </CardContent>
      </Card>
    </BuyerLayout>
  );
}

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * POST /api/orders/:id/confirm
 * Mengonfirmasi order dan mendapatkan token pembayaran
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await fetch(`${API_URL}/orders/${id}/confirm`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Gagal konfirmasi order" },
        { status: response.status }
      );
    }

    // Mengembalikan data { order, message, paymentToken, paymentRedirectUrl }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error confirming order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

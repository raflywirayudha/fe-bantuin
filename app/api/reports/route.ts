import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/lib/server-api-proxy";

export async function POST(request: NextRequest) {
  return proxyRequest(request, "/reports", "POST");
}

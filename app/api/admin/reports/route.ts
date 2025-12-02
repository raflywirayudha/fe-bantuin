import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server-api-proxy";

export async function GET(request: NextRequest) {
  // Forward request ke Backend NestJS: GET /api/reports/admin
  return proxyRequest(request, "/reports/admin", "GET");
}

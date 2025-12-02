import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server-api-proxy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/reports/admin/${id}`, "PATCH");
}

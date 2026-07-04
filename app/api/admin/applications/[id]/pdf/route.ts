import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const application = await prisma.driverApplication.findUnique({ where: { id } });
  if (!application?.pdfData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(application.pdfData), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${application.pdfFileName ?? "application.pdf"}"`,
    },
  });
}

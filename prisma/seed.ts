import bcrypt from "bcryptjs";
import { PrismaClient, ServiceCategory } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "safety@chavousllc.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-this-password";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Site Admin",
    },
  });

  await prisma.companyProfile.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Dry Van",
          description:
            "Standard enclosed trailers for palletized, boxed, and general freight — our primary equipment type, running nationwide lanes every day.",
          icon: "truck",
          category: ServiceCategory.DRY_VAN,
          featured: true,
          sortOrder: 0,
        },
        {
          title: "FTL (Full Truckload)",
          description:
            "A dedicated trailer for your freight alone — no stops, no sharing space, fastest transit from pickup to delivery.",
          icon: "boxes",
          category: ServiceCategory.FTL,
          featured: true,
          sortOrder: 1,
        },
        {
          title: "Partial Truckload",
          description:
            "Freight that's too big for LTL but doesn't need a full trailer — priced and routed for shipments in between.",
          icon: "layers",
          category: ServiceCategory.PARTIAL_TRUCKLOAD,
          featured: false,
          sortOrder: 2,
        },
        {
          title: "LTL (Less Than Truckload)",
          description:
            "Cost-effective shipping for smaller loads that don't need a full trailer, consolidated and routed efficiently.",
          icon: "package",
          category: ServiceCategory.LTL,
          featured: false,
          sortOrder: 3,
        },
        {
          title: "Expedited Freight",
          description:
            "Time-critical loads with dedicated drivers and priority scheduling when your shipment can't wait.",
          icon: "zap",
          category: ServiceCategory.EXPEDITED,
          featured: true,
          sortOrder: 4,
        },
        {
          title: "Dedicated Lanes",
          description:
            "Recurring contracted routes with consistent capacity and predictable transit times for regular shippers.",
          icon: "route",
          category: ServiceCategory.DEDICATED_LANES,
          featured: true,
          sortOrder: 5,
        },
        {
          title: "24/7 Dispatch & Tracking",
          description:
            "Real-time load tracking and a dispatch team on call around the clock, so you always know where your freight stands.",
          icon: "radar",
          category: ServiceCategory.DISPATCH_TRACKING,
          featured: false,
          sortOrder: 6,
        },
      ],
    });
  }

  console.log(`Seed complete. Admin login: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

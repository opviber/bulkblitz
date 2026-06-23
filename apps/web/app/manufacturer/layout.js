// =============================================================================
// /manufacturer/* layout — gates access and wraps content in SellerShell.
// =============================================================================
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SellerShell from "@/components/manufacturer/SellerShell";

export const dynamic = "force-dynamic";

export default async function ManufacturerLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth?next=/manufacturer&intent=seller");
  }

  const manufacturer = await prisma.manufacturer.findUnique({
    where: { userId: user.id },
  });

  // Buyer without a manufacturer profile: send them through the upgrade flow.
  if (!manufacturer) {
    redirect("/become-a-seller");
  }

  const kyc = await prisma.manufacturerKyc.findUnique({
    where: { manufacturerId: manufacturer.id },
    select: { status: true },
  });

  return (
    <SellerShell
      user={{ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }}
      manufacturer={{
        id: manufacturer.id,
        slug: manufacturer.slug,
        businessName: manufacturer.businessName,
        city: manufacturer.city,
        state: manufacturer.state,
        gstVerified: manufacturer.gstVerified,
      }}
      kycStatus={kyc?.status || "UNSUBMITTED"}
    >
      {children}
    </SellerShell>
  );
}

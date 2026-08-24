import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getCompanyProfile } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCompanyProfile();

  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} />
    </>
  );
}

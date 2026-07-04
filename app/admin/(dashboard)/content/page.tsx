import { getCompanyProfile, getServices } from "@/lib/content";
import { CompanyProfileForm } from "@/components/admin/CompanyProfileForm";
import { ServicesManager, type ServiceDraft } from "@/components/admin/ServicesManager";

export default async function AdminContentPage() {
  const [profile, services] = await Promise.all([getCompanyProfile(), getServices()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Site Content</h1>
        <p className="mt-1 text-sm text-ink-500">
          Changes here update the public site immediately.
        </p>
      </div>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-ink-900">Company Profile</h2>
        <div className="mt-6">
          <CompanyProfileForm profile={profile} />
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-ink-900">Services</h2>
        <div className="mt-6">
          <ServicesManager services={services as ServiceDraft[]} />
        </div>
      </section>
    </div>
  );
}

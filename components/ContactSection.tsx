import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { telHref } from "@/lib/format";
import type { CompanyProfile } from "@prisma/client";

export function ContactSection({ profile }: { profile: CompanyProfile }) {
  const info = [
    { icon: Phone, label: "Phone", value: profile.phone, href: telHref(profile.phone) },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Clock, label: "Dispatch Hours", value: profile.dispatchHours },
    { icon: MapPin, label: "Address", value: profile.address },
  ];

  return (
    <section id="contact" className="section scroll-mt-24 bg-ink-50/60">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">
            Let&apos;s talk freight
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-500">
            Have a question, need a status update, or want to talk lanes?
            Reach dispatch directly or send a message below.
          </p>

          <dl className="mt-10 space-y-6">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <item.icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-ink-800">
                    {item.href ? (
                      <a href={item.href} className="transition-colors hover:text-brand-600">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

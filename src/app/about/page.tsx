import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/constants";
import { Cpu, Globe, GraduationCap, Users } from "lucide-react";

export const metadata = generateMetadata({
  title: "About Us | QuantumComputingInfo",
  description: "About QuantumComputingInfo.com, our mission, our content team, and how we curate news and articles.",
  path: "/about",
});

export default function AboutPage() {
  const breadcrumbItems = [{ label: "About", href: "/about" }];

  const features = [
    {
      icon: Cpu,
      title: "Core Concepts",
      description:
        "We break down difficult ideas like qubits, superposition, entanglement, and decoherence into easy-to-understand explanations.",
    },
    {
      icon: Globe,
      title: "Automated Aggregation",
      description:
        "Our content pipeline fetches breaking news and research papers directly from arXiv, research labs, and tech firms, keeping you updated in real-time.",
    },
    {
      icon: GraduationCap,
      title: "Hands-on Tutorials",
      description:
        "We provide step-by-step guides using Qiskit, Python, and other modern quantum SDKs so you can run programs on real simulators and quantum hardware.",
    },
    {
      icon: Users,
      title: "Career Development",
      description:
        "Whether you're a software developer, physicist, or student, we outline learning pathways, key skills, and career resources to get you hired.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About QuantumComputingInfo</h1>
          <p className="mt-2 text-muted-foreground">Exploring the Quantum Frontier and Making it Accessible to Everyone.</p>
        </div>

        {/* Vision Section */}
        <section className="relative overflow-hidden rounded-xl border border-border bg-card p-8 mb-12">
          <div className="absolute top-0 right-0 size-64 rounded-full bg-violet-500/5 blur-[80px]" />
          <h2 className="text-xl font-semibold mb-4 text-violet-500 dark:text-violet-400">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Quantum computing is transitioning from academic research to practical industry reality. However, the learning curve is steep, and news is scattered across multiple blogs, journals, and preprints.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            <strong>QuantumComputingInfo.com</strong> was founded to bridge this gap. We combine original educational tutorials with an automated news aggregation system to offer a unified, real-time repository of quantum knowledge.
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-cyan-600 dark:text-cyan-400">What We Offer</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-3 inline-flex rounded-md bg-violet-600/10 p-2 text-violet-500 dark:text-violet-400">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Content Methodology */}
        <section className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Our Curation Policy</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We value intellectual property and content creator attribution. To ensure we provide comprehensive coverage without duplicating content:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Aggregated content is clearly tagged as <span className="font-semibold text-foreground">aggregated</span>.</li>
            <li>We do not reprint full articles; instead, we generate clean summaries and link directly to the original publisher.</li>
            <li>Every external source includes the original author/platform name and a direct URL back to the source.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

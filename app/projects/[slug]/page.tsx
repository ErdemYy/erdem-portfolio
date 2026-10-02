import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/Footer";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { getProject, projects } from "@/data/projects";
import { loc } from "@/i18n/config";

// Unknown slugs are a static 404 (prerendered, translated), not a dynamic render.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    // build-time metadata is Turkish; the client swaps it with the language
    description: loc(project.description, "tr"),
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title: project.title,
      description: loc(project.description, "tr"),
      url: `/projects/${project.id}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Header standalone />
      <main id="content">
        <ProjectDetails project={project} />
      </main>
      <Footer />
    </>
  );
}

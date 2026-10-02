import ProjectScreen from "@/components/projects/ProjectScreen";
import { featuredProject } from "@/data/projects";

/** The desk monitor runs the featured project as a live interface. */
export default function DeskScreen() {
  return <ProjectScreen project={featuredProject} />;
}

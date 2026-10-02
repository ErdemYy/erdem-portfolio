import type { TechCategory, Technology } from "@/types/portfolio";

/** Category order. Labels: `skills.categories.*` in the dictionaries. */
export const techCategories: TechCategory[] = [
  { key: "frontend" },
  { key: "backend" },
  { key: "database" },
  { key: "mobile" },
  { key: "infrastructure" },
  { key: "languages" },
];

/** No skill levels on purpose — relationships say more than bars do. */
export const technologies: Technology[] = [
  { id: "react", name: "React", category: "frontend" },
  { id: "nextjs", name: "Next.js", category: "frontend" },
  { id: "typescript", name: "TypeScript", category: "frontend" },
  { id: "javascript", name: "JavaScript", category: "frontend" },
  { id: "tailwind", name: "Tailwind CSS", category: "frontend" },
  { id: "threejs", name: "Three.js", category: "frontend" },

  { id: "nodejs", name: "Node.js", category: "backend" },
  { id: "nestjs", name: "NestJS", category: "backend" },
  { id: "fastapi", name: "FastAPI", category: "backend" },
  { id: "grpc", name: "gRPC", category: "backend" },

  { id: "sql", name: "SQL", category: "database" },
  { id: "mssql", name: "MSSQL", category: "database" },
  { id: "postgresql", name: "PostgreSQL", category: "database" },
  { id: "sqlite", name: "SQLite", category: "database" },
  { id: "supabase", name: "Supabase", category: "database" },
  { id: "firebase", name: "Firebase", category: "database" },

  { id: "flutter", name: "Flutter", category: "mobile" },
  { id: "dart", name: "Dart", category: "mobile" },
  { id: "unity", name: "Unity", category: "mobile" },
  { id: "tauri", name: "Tauri", category: "mobile" },

  { id: "docker", name: "Docker", category: "infrastructure" },

  { id: "c", name: "C", category: "languages" },
  { id: "csharp", name: "C#", category: "languages" },
  { id: "java", name: "Java", category: "languages" },
  { id: "python", name: "Python", category: "languages" },
  { id: "go", name: "Go", category: "languages" },
  { id: "rust", name: "Rust", category: "languages" },
];

/** Ecosystem relationships drawn as extra links in the constellation. */
export const techRelations: [string, string][] = [
  ["react", "nextjs"],
  ["nextjs", "typescript"],
  ["typescript", "javascript"],
  ["nestjs", "nodejs"],
  ["nestjs", "typescript"],
  ["flutter", "dart"],
  ["supabase", "postgresql"],
  ["mssql", "csharp"],
  ["postgresql", "sql"],
  ["nodejs", "docker"],
  ["fastapi", "python"],
  ["grpc", "go"],
  ["tauri", "rust"],
  ["threejs", "javascript"],
  ["tailwind", "nextjs"],
  ["firebase", "flutter"],
  ["unity", "csharp"],
];

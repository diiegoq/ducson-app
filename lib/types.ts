export interface Module {
  id: string;
  name: string;
  description: string;
  files: string[];
  fileCount: number;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  assignedTeamMember: string;
  description: string;
  files: string[];
  actions: string[];
}

export const DEFAULT_TEAM = [
  "Tech Lead",
  "Senior SWE",
  "Junior SWE",
  "DevOps Engineer",
  "Security Engineer"
];

export interface Component {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'api' | 'middleware';
  description: string;
  files: string[];
  dependencies: string[];
}

export interface Interaction {
  from: string;
  to: string;
  type: 'http' | 'database' | 'event' | 'import' | 'api-call';
  description: string;
}

export interface EntryPoint {
  file: string;
  type: 'server' | 'client' | 'cli' | 'worker';
  description: string;
}

export interface ArchitectureAnalysis {
  pattern: 'MVC' | 'Microservices' | 'Monolithic' | 'Serverless' | 'Layered' | 'Event-Driven';
  components: Component[];
  interactions: Interaction[];
  diagram: {
    type: 'mermaid';
    content: string;
    description: string;
  };
  entryPoints: EntryPoint[];
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  defaultValue?: string;
}

export interface DatabaseModel {
  name: string;
  file: string;
  fields: Field[];
  indexes: string[];
}

export interface Relationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description: string;
}

export interface DatabaseSchema {
  type: 'sql' | 'nosql' | 'mixed' | 'none';
  provider?: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis';
  orm?: 'prisma' | 'typeorm' | 'sequelize' | 'mongoose' | 'drizzle';
  models: DatabaseModel[];
  relationships: Relationship[];
  diagram: {
    type: 'mermaid';
    content: string;
    description: string;
  };
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lines?: number;
  language?: string;
  importance?: 'critical' | 'high' | 'medium' | 'low';
  children?: FileTreeNode[];
}

export interface FileTreeAnalysis {
  tree: FileTreeNode;
  statistics: {
    totalFiles: number;
    totalDirectories: number;
    totalLines: number;
    languageBreakdown: { language: string; percentage: number }[];
  };
  criticalFiles: string[];
  configFiles: string[];
}

export interface EnhancedOverviewResponse {
  repository: {
    owner: string;
    repo: string;
    description: string;
    language: string;
    stars: number;
    url: string;
  };
  modules: Module[];
  totalFiles: number;
  hasPackageJson: boolean;
  architecture: ArchitectureAnalysis;
  fileTree: FileTreeAnalysis;
  database: DatabaseSchema;
  techStack: {
    frameworks: string[];
    languages: { name: string; percentage: number }[];
    databases: string[];
    infrastructure: string[];
    testing: string[];
  };
  readme: {
    summary: string;
    sections: { title: string; content: string }[];
  };
}
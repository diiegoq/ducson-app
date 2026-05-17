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
  cveNumbers?: string[];
  owaspReferences?: string[];
  wcagGuidelines?: string[];
  businessImpact?: string;
  securityImpact?: string;
  exploitScenario?: string;
}

export type AnalysisPerspective =
  | 'business-logic'
  | 'technical-debt'
  | 'security'
  | 'ui-ux'
  | 'performance'
  | 'database'
  | 'testing'
  | 'devops'
  | 'api-design'
  | 'accessibility';

export interface PerspectiveInfo {
  id: AnalysisPerspective;
  name: string;
  description: string;
  icon: string;
  focusAreas: string[];
  targetRoles: string[];
  team: string[];
}

export const PERSPECTIVES: Record<AnalysisPerspective, PerspectiveInfo> = {
  'business-logic': {
    id: 'business-logic',
    name: 'Business Logic Analysis',
    description: 'Business rules, workflows, feature completeness',
    icon: '💼',
    focusAreas: ['Business Rules', 'Workflows', 'Feature Gaps', 'Data Validation'],
    targetRoles: ['Product Manager', 'Business Analyst'],
    team: ['Product Manager', 'Business Analyst', 'Tech Lead']
  },
  'technical-debt': {
    id: 'technical-debt',
    name: 'Technical Debt & Code Quality',
    description: 'Code smells, refactoring opportunities, maintainability',
    icon: '🔧',
    focusAreas: ['Code Smells', 'Refactoring', 'Maintainability', 'Best Practices'],
    targetRoles: ['Developer', 'Tech Lead'],
    team: ['Senior SWE', 'Tech Lead', 'Junior SWE']
  },
  'security': {
    id: 'security',
    name: 'Security Vulnerabilities',
    description: 'Security flaws, injection risks, authentication issues',
    icon: '🔒',
    focusAreas: ['Authentication', 'Injection', 'Data Exposure', 'Dependencies'],
    targetRoles: ['Security Engineer', 'DevOps'],
    team: ['Cybersecurity Engineer', 'Senior SWE', 'Tech Lead']
  },
  'ui-ux': {
    id: 'ui-ux',
    name: 'UI/UX Improvements',
    description: 'Accessibility, responsiveness, user experience',
    icon: '🎨',
    focusAreas: ['Accessibility', 'Responsive Design', 'User Experience', 'Performance'],
    targetRoles: ['Frontend Developer', 'UX Designer'],
    team: ['Frontend Developer', 'UX Designer', 'Senior SWE']
  },
  'performance': {
    id: 'performance',
    name: 'Performance & Scalability',
    description: 'Bottlenecks, optimization opportunities, scalability',
    icon: '⚡',
    focusAreas: ['Bottlenecks', 'Optimization', 'Scalability', 'Caching'],
    targetRoles: ['DevOps Engineer', 'Backend Developer'],
    team: ['DevOps Engineer', 'Backend Developer', 'Senior SWE']
  },
  'database': {
    id: 'database',
    name: 'Database & Data Management',
    description: 'Query optimization, schema design, data integrity',
    icon: '🗄️',
    focusAreas: ['Query Optimization', 'Schema Design', 'Data Integrity', 'Migrations'],
    targetRoles: ['Database Engineer', 'Backend Developer'],
    team: ['Database Engineer', 'Backend Developer', 'Senior SWE']
  },
  'testing': {
    id: 'testing',
    name: 'Testing & Quality Assurance',
    description: 'Test coverage, edge cases, testing strategy',
    icon: '🧪',
    focusAreas: ['Test Coverage', 'Edge Cases', 'Testing Strategy', 'Automation'],
    targetRoles: ['QA Engineer', 'Test Automation Engineer'],
    team: ['QA Engineer', 'Test Automation Engineer', 'Senior SWE']
  },
  'devops': {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    description: 'CI/CD, deployment, monitoring, infrastructure',
    icon: '🚀',
    focusAreas: ['CI/CD', 'Deployment', 'Monitoring', 'Infrastructure'],
    targetRoles: ['DevOps Engineer', 'SRE'],
    team: ['DevOps Engineer', 'SRE', 'Tech Lead']
  },
  'api-design': {
    id: 'api-design',
    name: 'API Design & Documentation',
    description: 'API consistency, documentation, versioning',
    icon: '📡',
    focusAreas: ['API Consistency', 'Documentation', 'Versioning', 'Standards'],
    targetRoles: ['API Developer', 'Technical Writer'],
    team: ['API Developer', 'Technical Writer', 'Senior SWE']
  },
  'accessibility': {
    id: 'accessibility',
    name: 'Accessibility Compliance',
    description: 'WCAG compliance, screen reader support, keyboard navigation',
    icon: '♿',
    focusAreas: ['WCAG Compliance', 'Screen Readers', 'Keyboard Navigation', 'Color Contrast'],
    targetRoles: ['Accessibility Specialist', 'Frontend Developer'],
    team: ['Accessibility Specialist', 'Frontend Developer', 'UX Designer']
  }
};

export const DEFAULT_TEAM = [
  "Tech Lead",
  "Senior SWE",
  "Junior SWE",
  "DevOps Engineer",
  "Security Engineer"
];

export interface PerspectiveInsights {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  metrics?: Record<string, number | string>;
}

export interface PerspectiveAnalysisResponse {
  perspective: AnalysisPerspective;
  tickets: Ticket[];
  perspectiveInsights: PerspectiveInsights;
  risks?: Risk[];
  insights?: GeneralInsights;
  diagram?: Diagram;
  onboardingGuide?: OnboardingGuide;
}

export interface Risk {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  mitigation: string;
}

export interface GeneralInsights {
  complexity: string;
  maintainability: string;
  testability: string;
}

export interface Diagram {
  type: string;
  content: string;
  description: string;
}

export interface OnboardingGuide {
  overview: string;
  keyFiles: string[];
  setupSteps: string[];
}

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
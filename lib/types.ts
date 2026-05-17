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
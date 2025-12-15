export type ProjectType = 'Development' | 'Marketing' | 'Design' | 'Finance';

export type GroupType = 'urgent' | 'today' | 'tomorrow' | 'waiting' | 'not-urgent' | 'done';

export interface Task {
  id: number;
  title: string;
  desc: string;
  project: ProjectType | string; // Allowing string to accommodate potential new projects
  group: GroupType;
  dueDate?: string;
}

export interface ColumnDefinition {
  id: GroupType;
  title: string;
}
// src/app/models/task.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  status: string; // 'To Do' | 'In Progress' | 'Completed'
}
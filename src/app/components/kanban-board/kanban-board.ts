import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';

import {
  DragDropModule,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  status: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css']
})
export class KanbanBoardComponent implements OnInit, AfterViewInit {

  /* ===================== COLUMNS ===================== */
  columns: string[] = [];
  newColumnName: string = '';

  /* ===================== TASKS ===================== */
  tasks: Task[] = [];

  /* ===================== UI STATE ===================== */
  showAddForm: { [key: string]: boolean } = {};
  newTask: { [key: string]: Partial<Task> } = {};
  editTaskId: number | null = null;

  notification: string | null = null;
  notificationType: 'success' | 'warning' | 'info' = 'info';
  notificationPosition: 'left' | 'center' | 'right' = 'center';

  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  /* ===================== LIFECYCLE ===================== */

  ngOnInit(): void {

    const savedColumns = localStorage.getItem('kanban-columns');
    this.columns = savedColumns
      ? JSON.parse(savedColumns)
      : ['To Do', 'In Progress', 'Completed'];

    const savedTasks = localStorage.getItem('kanban-data');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  ngAfterViewInit(): void {

    this.updateDropLists();

    this.dropLists.changes.subscribe(() => {
      this.updateDropLists();
    });
  }

  /* ===================== DRAG LIST CONNECTION ===================== */

  updateDropLists(): void {

    const lists = this.dropLists.toArray();

    lists.forEach(list => {
      list.connectedTo = lists.map(l => l.id);
    });

  }

  /* ===================== STORAGE ===================== */

  saveToLocalStorage(): void {
    localStorage.setItem('kanban-data', JSON.stringify(this.tasks));
  }

  saveColumns(): void {
    localStorage.setItem('kanban-columns', JSON.stringify(this.columns));
  }

  /* ===================== COLUMN MANAGEMENT ===================== */

  addColumn(): void {

    if (!this.newColumnName.trim()) return;

    this.columns.push(this.newColumnName.trim());

    this.saveColumns();

    this.newColumnName = '';

    setTimeout(() => {
      this.updateDropLists();
    });

    this.showNotification('New column added 📁', 'success', 'left');
  }

  deleteColumn(column: string): void {

    if (this.columns.length <= 1) {
      this.showNotification('At least one column must remain ⚠️', 'warning', 'center');
      return;
    }

    const confirmDelete = confirm(`Delete column "${column}"?`);

    if (!confirmDelete) return;

    this.columns = this.columns.filter(c => c !== column);

    const fallbackColumn = this.columns[0];

    this.tasks.forEach(task => {
      if (task.status === column) {
        task.status = fallbackColumn;
      }
    });

    this.saveColumns();
    this.saveToLocalStorage();

    this.showNotification(`Column "${column}" deleted 🗑️`, 'warning', 'right');
  }

  /* ===================== NOTIFICATION ===================== */

  showNotification(
    message: string,
    type: 'success' | 'warning' | 'info',
    position: 'left' | 'center' | 'right'
  ): void {

    this.notification = message;
    this.notificationType = type;
    this.notificationPosition = position;

    setTimeout(() => {
      this.notification = null;
    }, 2000);

  }

  /* ===================== HELPERS ===================== */

  getTasksForColumn(column: string): Task[] {
    return this.tasks.filter(task => task.status === column);
  }

  /* ===================== TASK FORM ===================== */

  toggleAddForm(column: string): void {

    this.showAddForm[column] = !this.showAddForm[column];

    this.newTask[column] = {};

    this.editTaskId = null;
  }

  addTask(column: string): void {

    const t = this.newTask[column];

    if (!t?.id || !t?.title) return;

    if (this.editTaskId !== null) {

      const task = this.tasks.find(x => x.id === this.editTaskId);

      if (task) Object.assign(task, t);

      this.showNotification('Task updated ✏️', 'info', 'center');

      this.editTaskId = null;

    } else {

      this.tasks.push({
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: t.priority || 'Low',
        assignee: t.assignee || '',
        dueDate: t.dueDate || '',
        status: column
      });

      this.showNotification(`Task created in ${column} ✅`, 'success', 'left');

    }

    this.saveToLocalStorage();

    this.toggleAddForm(column);
  }

  editTask(task: Task, column: string): void {

    this.editTaskId = task.id;

    this.showAddForm[column] = true;

    this.newTask[column] = { ...task };
  }

  deleteTask(id: number): void {

    this.tasks = this.tasks.filter(task => task.id !== id);

    this.saveToLocalStorage();

    this.showNotification('Task deleted 🗑️', 'warning', 'right');
  }

  /* ===================== DRAG & DROP ===================== */

 drop(event: CdkDragDrop<Task[]>, column: string): void {

  const columnTasks = this.tasks.filter(task => task.status === column);

  if (event.previousContainer === event.container) {

    moveItemInArray(columnTasks, event.previousIndex, event.currentIndex);

    /* Update order in main tasks array */

    const otherTasks = this.tasks.filter(task => task.status !== column);

    this.tasks = [...otherTasks, ...columnTasks];

    this.showNotification('Task reordered ↕️', 'info', 'center');

  } 
  else {

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    event.container.data.forEach(task => {
      task.status = column;
    });

    this.showNotification(`Task moved to ${column} 🔁`, 'success', 'center');
  }

  this.saveToLocalStorage();

}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KanbanDataService {

  private taskSource = new BehaviorSubject<any[]>([]);
  tasks$ = this.taskSource.asObservable();

  updateTasks(tasks: any[]) {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    this.taskSource.next(tasks);
  }

  loadTasks() {
    const data = localStorage.getItem('kanbanTasks');
    this.taskSource.next(data ? JSON.parse(data) : []);
  }
}
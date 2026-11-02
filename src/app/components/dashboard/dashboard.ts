import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';


interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  status: string;
}

interface AssigneeProgress {
  name: string;
  total: number;
  completed: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule,NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  columns: string[] = [];

  columnCounts: { [key: string]: number } = {};
  totalTasks = 0;
  completionRate = 0;

  // ===== NEW FEATURE =====
  assigneeProgressList: AssigneeProgress[] = [];

  chart: any;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  /* ================= LOAD DATA ================= */
  loadData(): void {

    const savedTasks = localStorage.getItem('kanban-data');
    const savedColumns = localStorage.getItem('kanban-columns');

    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    this.columns = savedColumns
      ? JSON.parse(savedColumns)
      : ['To Do', 'In Progress', 'Completed'];

    this.calculateStats();
    this.calculateAssigneeProgress();   // 🔥 NEW
    this.renderChart();
  }

  /* ================= CALCULATE COLUMN STATS ================= */
  calculateStats(): void {

    this.columnCounts = {};
    this.totalTasks = this.tasks.length;

    this.columns.forEach(column => {
      this.columnCounts[column] =
        this.tasks.filter(task => task.status === column).length;
    });

    const completedColumn = this.columns.find(c =>
      c.toLowerCase().includes('complete')
    );

    const completedCount = completedColumn
      ? this.columnCounts[completedColumn]
      : 0;

    this.completionRate = this.totalTasks
      ? Math.round((completedCount / this.totalTasks) * 100)
      : 0;
  }

  /* ================= NEW: ASSIGNEE PROGRESS ================= */
  calculateAssigneeProgress(): void {

    const map: { [key: string]: { total: number; completed: number } } = {};

    this.tasks.forEach(task => {

      const name = task.assignee?.trim() || 'Unassigned';

      if (!map[name]) {
        map[name] = { total: 0, completed: 0 };
      }

      map[name].total++;

      // Check completed column dynamically
      const completedColumn = this.columns.find(c =>
        c.toLowerCase().includes('complete')
      );

      if (task.status === completedColumn) {
        map[name].completed++;
      }
    });

    this.assigneeProgressList = Object.keys(map).map(name => {

      const total = map[name].total;
      const completed = map[name].completed;

      return {
        name,
        total,
        completed,
        percentage: total
          ? Math.round((completed / total) * 100)
          : 0
      };
    });
  }

  /* ================= CHART ================= */
  renderChart(): void {

    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.columns,
        datasets: [{
          data: this.columns.map(col => this.columnCounts[col]),
          backgroundColor: this.generateColors(this.columns.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 12
              }
            }
          },
          datalabels: {
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value: number, context: any) => {

              const data = context.chart.data.datasets[0].data as number[];
              const total = data.reduce((a, b) => a + b, 0);

              const percentage = total
                ? ((value / total) * 100).toFixed(0) + '%'
                : '0%';

              const label = context.chart.data.labels[context.dataIndex];

              return label + '\n' + percentage;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  /* ================= BLUE THEME COLORS ================= */
  generateColors(count: number): string[] {
    const blueThemeColors = [
      '#0d47a1',
      '#1565c0',
      '#1976d2',
      '#1e88e5',
      '#42a5f5',
      '#64b5f6',
      '#29b6f6',
      '#5c6bc0',
      '#90caf9',
      '#bbdefb'
    ];

    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(blueThemeColors[i % blueThemeColors.length]);
    }

    return colors;
  }
  getCompletedColumn(): string | undefined {
  return this.columns.find(function(c) {
    return c.toLowerCase().includes('complete');
  });
}
}
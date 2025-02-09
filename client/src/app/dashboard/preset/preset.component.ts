import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Preset, Task } from 'src/app/models';
import { TaskEvent, TaskComponent } from '../../task/task.component';
import { NewTaskComponent } from '../../new-task/new-task.component';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { PresetService } from '../presets/preset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-preset',
  imports: [
    TaskComponent,
    NewTaskComponent,
    CdkDropList,
    NgOptimizedImage,
    ReactiveFormsModule,
    TaskComponent,
  ],
  templateUrl: './preset.component.html',
  styleUrl: './preset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetComponent implements OnInit {
  private readonly presetsService = inject(PresetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly preset = computed(() => this.presetsService.activePreset());
  private readonly presetId = signal<string>('');

  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly tasksControl = new FormArray<FormControl<string>>([]);
  readonly titleControl = new FormControl<Preset['title']>('', {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.loadPreset();
  }

  constructor() {
    effect(() => {
      const preset = this.preset();
      if (preset) {
        this.titleControl.setValue(preset.title);
        this.initializeTasks(preset.tasks);
      }
      this.cdr.markForCheck();
    });
  }

  private initializeTasks(tasks: string[]): void {
    this.tasksControl.clear();
    tasks.forEach(description => {
      this.tasksControl.push(
        new FormControl(description, { nonNullable: true }),
      );
    });
  }

  private loadPreset(): void {
    const presetId = this.route.snapshot.paramMap.get('id');
    if (presetId) {
      this.presetId.set(presetId);
      this.presetsService.fetchPreset(presetId);
    }
  }

  addNewTask(task: string): void {
    if (!task.trim()) {
      return;
    }
    this.tasksControl.push(new FormControl(task, { nonNullable: true }));
    this.newTaskControl.setValue('');
  }

  handleTaskUpdate({ task, event }: TaskEvent): void {
    if (event === 'delete') {
      const index = this.tasksControl.controls.findIndex(
        control => control.value === task.description,
      );
      if (index !== -1) {
        this.tasksControl.removeAt(index);
      }
    }
  }

  savePreset(): void {
    this.presetsService.updatePreset(this.presetId(), {
      title: this.titleControl.value,
      tasks: this.tasksControl.value,
    });
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    moveItemInArray(
      this.tasksControl.controls,
      event.previousIndex,
      event.currentIndex,
    );
  }
}

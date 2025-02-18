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
import type { Preset, Task } from 'src/app/models';
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
import { PresetTaskComponent } from '../presets/preset-task/preset-task/preset-task.component';

@Component({
  selector: 'app-preset',
  imports: [
    NewTaskComponent,
    CdkDropList,
    NgOptimizedImage,
    ReactiveFormsModule,
    PresetTaskComponent,
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

  readonly tasksForm = new FormArray<FormControl<string>>([]);
  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
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
    this.tasksForm.clear();
    tasks.forEach(description => {
      this.tasksForm.push(new FormControl(description, { nonNullable: true }));
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
    this.tasksForm.push(new FormControl(task, { nonNullable: true }));
    this.newTaskControl.setValue('');
  }

  deleteTask(task: string): void {
    const index = this.tasksForm.controls.findIndex(
      control => control.value === task,
    );
    if (index !== -1) {
      this.tasksForm.removeAt(index);
    }
  }

  savePreset(): void {
    this.presetsService.updatePreset(this.presetId(), {
      title: this.titleControl.value,
      tasks: this.tasksForm.value,
    });
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    moveItemInArray(
      this.tasksForm.controls,
      event.previousIndex,
      event.currentIndex,
    );
    this.tasksForm.setValue(this.tasksForm.controls.map(c => c.value));
  }
}

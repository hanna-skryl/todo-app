import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PresetTaskComponent } from '../presets/preset-task/preset-task/preset-task.component';
import { PresetsStore } from 'src/app/store/presets.store';

@Component({
  selector: 'app-preset',
  imports: [
    NewTaskComponent,
    CdkDropList,
    ReactiveFormsModule,
    PresetTaskComponent,
    RouterLink,
  ],
  templateUrl: './preset.component.html',
  styleUrl: './preset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetComponent implements OnInit, OnDestroy {
  readonly store = inject(PresetsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly tasksForm = new FormArray<FormControl<string>>([]);
  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly titleControl = new FormControl<Preset['title']>('', {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.loadPreset();
  }

  ngOnDestroy(): void {
    this.store.resetActivePreset();
  }

  constructor() {
    effect(() => this.syncFormWithStore());
  }

  private syncFormWithStore(): void {
    const preset = this.store.activePreset();
    if (preset) {
      this.titleControl.setValue(preset.title);
      this.tasksForm.clear();
      preset.tasks.forEach(description => {
        this.tasksForm.push(
          new FormControl(description, { nonNullable: true }),
        );
      });
      this.cdr.markForCheck();
    }
  }

  private loadPreset(): void {
    const presetId = this.route.snapshot.paramMap.get('id');
    if (presetId) {
      this.store.setLoading(true);
      this.store.loadPreset(presetId);
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
    this.store.updatePreset({
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
    const updatedTasks = this.tasksForm.controls.map(control => control.value);
    this.store.updatePreset({
      title: this.titleControl.value,
      tasks: updatedTasks,
    });
  }
}

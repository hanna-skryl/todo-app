import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import type { Preset, Task } from '../../models';
import { NewTaskComponent } from '../../shared/new-task/new-task.component';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { type CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Router, RouterLink } from '@angular/router';
import { PresetTaskComponent } from '../presets/preset-task/preset-task.component';
import { PresetsStore } from '../../store/presets.store';

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
export class PresetComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly store = inject(PresetsStore);

  readonly id = input.required<string>();
  readonly loading = computed(() => this.store.loading());

  readonly newTaskControl = new FormControl<string>('', { nonNullable: true });
  readonly tasksForm = new FormArray<FormControl<string>>([]);
  readonly titleControl = new FormControl<Preset['title']>('', {
    nonNullable: true,
  });

  constructor() {
    effect(() => this.store.fetchPreset(this.id()));
    effect(() => {
      const preset = this.store.activePreset();
      if (preset) {
        this.initForm(preset);
      }
    });
  }

  ngOnDestroy(): void {
    this.store.resetActivePreset();
  }

  addTask(task: string): void {
    this.tasksForm.push(new FormControl(task, { nonNullable: true }));
    this.newTaskControl.setValue('');
  }

  deleteTask(index: number): void {
    this.tasksForm.removeAt(index);
  }

  savePreset(): void {
    this.store.updatePreset({
      title: this.titleControl.value,
      tasks: this.tasksForm.value,
    });
    this.router.navigate(['/dashboard/presets']);
  }

  reorderTasks(event: CdkDragDrop<Task[]>): void {
    const { previousIndex, currentIndex } = event;
    const control = this.tasksForm.at(previousIndex);
    this.tasksForm.removeAt(previousIndex);
    this.tasksForm.insert(currentIndex, control);
  }

  private initForm(preset: Preset): void {
    this.titleControl.setValue(preset.title);
    this.tasksForm.clear();

    preset.tasks.forEach(description => {
      this.tasksForm.push(new FormControl(description, { nonNullable: true }));
    });
  }
}

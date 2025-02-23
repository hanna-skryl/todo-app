import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { PresetCardComponent } from './preset-card/preset-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PresetsStore } from 'src/app/store/presets.store';

@Component({
  selector: 'app-presets',
  imports: [PresetCardComponent, ReactiveFormsModule],
  templateUrl: './presets.component.html',
  styleUrl: './presets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetsComponent implements OnInit {
  readonly store = inject(PresetsStore);

  readonly newPreset = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.store.setLoading(true);
    this.store.fetchPresets();
  }

  createPreset(): void {
    const title = this.newPreset.value.trim();
    if (title) {
      this.store.createPreset({ title, tasks: [] });
      this.newPreset.reset();
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Preset } from '../../models';
import { PresetService } from './preset.service';
import { PresetCardComponent } from './preset-card/preset-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-presets',
  imports: [PresetCardComponent, ReactiveFormsModule],
  templateUrl: './presets.component.html',
  styleUrl: './presets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetsComponent implements OnInit {
  private readonly presetsService = inject(PresetService);
  readonly presets = computed<Preset[]>(() => this.presetsService.presets());

  readonly newPreset = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.loadPresets();
  }

  private loadPresets(): void {
    this.presetsService.fetchPresets();
  }

  createPreset(): void {
    const title = this.newPreset.value.trim();
    if (title) {
      this.presetsService.createPreset({ title, tasks: [] });
      this.newPreset.reset();
    }
  }
}

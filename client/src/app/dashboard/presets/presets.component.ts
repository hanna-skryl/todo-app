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

@Component({
  selector: 'app-presets',
  imports: [PresetCardComponent],
  templateUrl: './presets.component.html',
  styleUrl: './presets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetsComponent implements OnInit {
  private readonly presetsService = inject(PresetService);
  readonly presets = computed<Preset[]>(() => this.presetsService.presets());

  ngOnInit(): void {
    this.loadPresets();
  }

  private loadPresets(): void {
    this.presetsService.fetchPresets();
  }
}

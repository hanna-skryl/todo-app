import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Preset } from '../models';
import { PresetService } from './preset.service';

@Component({
  selector: 'app-presets',
  imports: [],
  templateUrl: './presets.component.html',
  styleUrl: './presets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetsComponent implements OnInit {
  private readonly presetsService = inject(PresetService);
  readonly presets = computed<Preset[]>(() => this.presetsService.presets());

  ngOnInit(): void {
    this.presetsService.getPresets();
  }
}

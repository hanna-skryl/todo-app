import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Preset } from 'src/app/models';

@Component({
  selector: 'app-preset-list',
  imports: [],
  templateUrl: './preset-list.component.html',
  styleUrl: './preset-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetListComponent {
  readonly items = input<Preset[]>([]);
}

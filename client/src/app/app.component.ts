import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoStore } from './store/todo.store';
import { HeaderComponent } from './app-shell/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly store = inject(TodoStore);

  ngOnInit(): void {
    this.store.setLoading(true);
    this.store.loadData();
  }
}

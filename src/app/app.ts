import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { Musiclist } from './view/musiclist/musiclist';
import { Player } from './view/player/player';
import { Addform } from './view/addform/addform';

@Component({
  selector: 'app-root',
  imports: [Musiclist, Player, Addform],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private _viewMode: WritableSignal<string>;

  constructor() {
    this._viewMode = signal<string>("General");
  }

  public get viewMode(): Signal<string> {
    return this._viewMode.asReadonly();
  }

  public switchViewMode(mode: string) {
    this._viewMode.set(mode);
  }
}

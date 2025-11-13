import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  private _songToPlay: Signal<any>;
  
  public _songRecived: InputSignal<any> = input<any>();

  public _changeViewMode: OutputEmitterRef<any> = output();
  
  constructor() {
    this._songToPlay = computed<any>(() => this._songRecived());
  }

  public get songToPlay(): Signal<any> {
    return this._songToPlay;
  }

  public changeViewMode(mode: string) {
    this._changeViewMode.emit(mode);
  }
}

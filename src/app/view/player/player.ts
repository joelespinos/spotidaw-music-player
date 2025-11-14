import { Component, computed, input, InputSignal, output, OutputEmitterRef, signal, Signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons/faHeart';

@Component({
  selector: 'app-player',
  imports: [FontAwesomeModule],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  private _songToPlay: Signal<any>;
  private _solidHeart: Signal<any>;
  private _regularHeart: Signal<any>;
  
  public _songRecived: InputSignal<any> = input<any>();

  public _changeViewMode: OutputEmitterRef<any> = output();
  public _adviceToSaveLocalStorage: OutputEmitterRef<void> = output(); // Aquest output ens servira per avisar que s'ha desar el LocalStorage quan el usuari marca la cançó que se esta reproduint al player com favorita
  
  constructor() {
    this._songToPlay = computed<any>(() => this._songRecived());

    this._solidHeart = signal<any>(fasHeart).asReadonly();
    this._regularHeart = signal<any>(farHeart).asReadonly();
  }

  public get songToPlay(): Signal<any> {
    return this._songToPlay;
  }

  public get favoriteIcon(): Signal<any> {
    if (this._songToPlay().favorite) return this._solidHeart;
    else return this._regularHeart;
  }

  public changeViewMode(mode: string) {
    this._changeViewMode.emit(mode);
  }

  public onChangeFavoriteStatus(): void {
    this._songToPlay().favorite = !this._songToPlay().favorite;
    this._adviceToSaveLocalStorage.emit(); // Com se canvia el estat de favorit de la cançó hem d'avisar de guardar LS
  }
}

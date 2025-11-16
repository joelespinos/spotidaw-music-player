import { ChangeDetectionStrategy, Component, computed, effect, input, InputSignal, output, OutputEmitterRef, signal, Signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-player',
  imports: [FontAwesomeModule],
  templateUrl: './player.html',
  styleUrl: './player.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Player {
  private _songToPlay: Signal<any>;
  private _solidHeart: Signal<any>;
  private _regularHeart: Signal<any>;
  private _closeIcon: Signal<any>;
  
  public _songRecived: InputSignal<any> = input<any>();
  public _songIdToFavorite: InputSignal<number> = input<number>(-1);

  public _changeViewMode: OutputEmitterRef<any> = output();
  public _adviceToSaveLocalStorage: OutputEmitterRef<void> = output(); // Aquest output ens servira per avisar que s'ha desar el LocalStorage quan el usuari marca la cançó que se esta reproduint al player com favorita
  public _adviceToResetsongIdFavorite: OutputEmitterRef<void> = output(); // Resetejem el Id de la cançó que hem canviat el estat de favorite per que detecti detecte els posterios canvis

  constructor() {
    this._songToPlay = computed<any>(() => this._songRecived());

    this._solidHeart = signal<any>(fasHeart).asReadonly();
    this._regularHeart = signal<any>(farHeart).asReadonly();
    this._closeIcon = signal<any>(faX);

    effect(() => { // Resetejem el Id per a que es pugui tornar a canviar en els seguients clicks
      if (this._songIdToFavorite() !== -1) {
        this._adviceToResetsongIdFavorite.emit();
      }
    });
  }

  public get songToPlay(): Signal<any> {
    return this._songToPlay;
  }

  public get favoriteIcon(): Signal<any> {
    if (this._songToPlay().favorite) return this._solidHeart;
    else return this._regularHeart;
  }
  
  public get closeIcon(): Signal<any> {
    return this._closeIcon;
  }

  public changeViewMode(mode: string) {
    this._changeViewMode.emit(mode);
  }

  public onChangeFavoriteStatus(songId: number): void {
    if (songId === this._songToPlay().songId) {
      this._songToPlay().favorite = !this._songToPlay().favorite;
      this._adviceToSaveLocalStorage.emit(); // Com se canvia el estat de favorit de la cançó hem d'avisar de guardar LS
    }
  }
}

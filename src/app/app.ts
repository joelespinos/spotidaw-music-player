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
  private _songToAddOnMusicList: WritableSignal<any>;
  private _songToPlayOnPlayer: WritableSignal<any>;
  private _shoudSaveLocalStorage: WritableSignal<boolean>;
  private _songIdToPutFavoritePlayer: WritableSignal<number>

  constructor() {
    this._viewMode = signal<string>("General");
    this._songToAddOnMusicList = signal<any>("");
    this._songToPlayOnPlayer = signal<any>("");
    this._shoudSaveLocalStorage = signal<boolean>(false);
    this._songIdToPutFavoritePlayer = signal<number>(-1);
  }

  public get viewMode(): Signal<string> {
    return this._viewMode.asReadonly();
  }

  public get songToAddOnMusicList(): Signal<any> {
    return this._songToAddOnMusicList.asReadonly();
  }

  public get songToPlayOnPlayer(): Signal<any> {
    return this._songToPlayOnPlayer.asReadonly();
  }

  public get shoudSaveLocalStorage(): Signal<boolean> {
    return this._shoudSaveLocalStorage.asReadonly();
  }

  public get songIdToPutFavoritePlayer(): Signal<number> {
    return this._songIdToPutFavoritePlayer.asReadonly();
  }

  public switchViewMode(mode: string): void {
    this._viewMode.set(mode);
  }

  public handleNewSong(newSong: any): void {
    this._songToAddOnMusicList.set(newSong);
  }

  public giveSongToPlayer(songToPlay: any): void {
    this._songToPlayOnPlayer.set(songToPlay);
  }

  public onSaveLocalStorage(): void {
    this._shoudSaveLocalStorage.set(true);
  }

  public onSetAdviceFalse(): void {
    this._shoudSaveLocalStorage.set(false); // Tornem a ficar el signal que conte si s'ha de actualitzar el LSan true per a que posteriorment el InputSignal del MusicList salti per canvi de valor a true.
  }

  public onChangeFavoriteStatusPlayer(songId: number): void {
    this._songIdToPutFavoritePlayer.set(songId);
  }

  public onResetIdFavorite(): void {
    this._songIdToPutFavoritePlayer.set(-1);
  }
}

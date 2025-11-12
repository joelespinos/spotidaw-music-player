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

  constructor() {
    this._viewMode = signal<string>("General");
    this._songToAddOnMusicList = signal<any>("");
    this._songToPlayOnPlayer = signal<any>("");
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

  public switchViewMode(mode: string): void {
    this._viewMode.set(mode);
  }

  public handleNewSong(newSong: any): void {
    this._songToAddOnMusicList.set(newSong);
  }

  public giveSongToPlayer(songToPlay: any): void {
    this._songToPlayOnPlayer.set(songToPlay);
  }
}

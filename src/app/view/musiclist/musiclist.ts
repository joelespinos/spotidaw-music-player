import { Component, computed, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SONGS } from '../../model/songs';

@Component({
  selector: 'app-musiclist',
  imports: [FormsModule],
  templateUrl: './musiclist.html',
  styleUrl: './musiclist.css',
})

export class Musiclist {
  private _songsList: WritableSignal<any[]>;
  private _filteredSongsList: Signal<any[]>;
  private _searchSong: WritableSignal<string>;
  public _changeViewMode: OutputEmitterRef<string> = output();

  constructor() {
   let storedSongsList = localStorage.getItem("STORED_SONGS");
   
   if (storedSongsList === null) this._songsList = signal<any[]>(SONGS);
   else this._songsList = signal<any[]>(JSON.parse(storedSongsList));

   this._filteredSongsList = computed<any[]>(() => {
    let filteredList: any[] = [];

    if (this._searchSong().length > 0) {
      for (let i = 0; i < this._songsList().length; i++) {
        if (this._songsList()[i].title.includes(this._searchSong()) || this._songsList()[i].artist.includes(this._searchSong())) {
          filteredList.push(this._songsList()[i]);
        }
      }
    }

    return filteredList;
   });
   this._searchSong = signal<string>("");
  }

  public get songsList(): Signal<any[]> {
    return this._songsList.asReadonly();
  }

  public get filteredSongsList(): Signal<any> {
    return this._filteredSongsList;
  }

  public get searchSong(): WritableSignal<string> {
    return this._searchSong;
  }

  public changeViewModeToAddForm(): void {
    this._changeViewMode.emit("AddForm");
  }

}

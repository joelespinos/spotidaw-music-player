import { Component, computed, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SONGS } from '../../model/songs';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-musiclist',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './musiclist.html',
  styleUrl: './musiclist.css',
})

export class Musiclist {
  private _songsList: Signal<any[]>; // Llista de cançons
  private _shownSongsList: Signal<any[]>; // Llista de cançons que es mostraran a l'usuari (degut a que aquesta llista anira fent-se més petita o gran depenent en la cerca de l'usuari)
  private _searchSong: WritableSignal<string>;
  private _solidHeart: Signal<any>;
  private _regularHeart: Signal<any>;
  public _changeViewMode: OutputEmitterRef<string> = output();

  constructor() {
   let storedSongsList = localStorage.getItem("STORED_SONGS");
   
   if (storedSongsList === null) this._songsList = signal<any[]>(SONGS).asReadonly();
   else this._songsList = signal<any[]>(JSON.parse(storedSongsList)).asReadonly();

   this._shownSongsList = computed<any[]>(() => {
    let filteredList: any[] = [];

    if (this._searchSong().length > 0) {
      for (let i = 0; i < this._songsList().length; i++) {
        if (this._songsList()[i].title.includes(this._searchSong()) || this._songsList()[i].artist.includes(this._searchSong())) {
          filteredList.push(this._songsList()[i]);
        }
      }
    } else {
      for (let i = 0; i < this._songsList().length; i++) {
        filteredList.push(this._songsList()[i]);
      }
    }

    return filteredList;
   });
   
   this._searchSong = signal<string>("");
   this._solidHeart = signal<any>(fasHeart).asReadonly();
   this._regularHeart = signal<any>(farHeart).asReadonly();
  }

  public get songsList(): Signal<any[]> {
    return this._songsList;
  }

  public get shownSongsList(): Signal<any> {
    return this._shownSongsList;
  }

  public get searchSong(): WritableSignal<string> {
    return this._searchSong;
  }

  public changeViewMode(mode: string): void {
    this._changeViewMode.emit(mode);
  }

  public getIconByFavorite(songId: number): Signal<any> {
    for (let i = 0; i < this._songsList().length; i++) {
      let currentSong: any = this._songsList()[i];
      if (currentSong.songId === songId) {
        if (currentSong.favorite === true) return this._solidHeart;
        else return this._regularHeart;
      }
    }
    return this._regularHeart;
  }

  public onChangeFavoriteStatus(songId: number): void {
    let i: number = 0;
    let found: boolean = false;

    while (i < this._songsList().length && !found) {
      if(this._songsList()[i].songId === songId){
        this._songsList()[i].favorite = !this._songsList()[i].favorite; 
        found = true;
      } 
      i++;
    }
    
    localStorage.setItem("STORED_SONGS", JSON.stringify(this._songsList()));
  }

}

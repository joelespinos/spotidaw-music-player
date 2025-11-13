import { Component, computed, effect, input, InputSignal, output, OutputEmitterRef, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SONGS } from '../../model/songs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-musiclist',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './musiclist.html',
  styleUrl: './musiclist.css',
})

export class Musiclist {
  private _songsList: WritableSignal<any[]>; // Llista de cançons
  private _shownSongsList: Signal<any[]>; // Llista de cançons que es mostraran a l'usuari (degut a que aquesta llista anira fent-se més petita o gran depenent en la cerca de l'usuari)
  private _searchSong: WritableSignal<string>;
  private _solidHeart: Signal<any>;
  private _regularHeart: Signal<any>;
  private _idSongSelected: WritableSignal<number>;
  private _regularPlus: Signal<any>;
  private _regularSearch: Signal<any>;

  public _newSongToAdd: InputSignal<any> = input<any>();
  //public _actualViewMode: InputSignal<string> = input<string>(); // Escolta sempre el estat actual de la web, ens servira posteriorment per si el mode es General o AddForm que deseleccioni la cançó actual, en cas que hagi alguna.
  
  public _changeViewMode: OutputEmitterRef<string> = output();
  public _songToPlay: OutputEmitterRef<any> = output();

  constructor() {
    let storedSongsList = localStorage.getItem("STORED_SONGS");
    if (storedSongsList === null) this._songsList = signal<any>(SONGS);
    else this._songsList = signal<any[]>(JSON.parse(storedSongsList));

    effect(() => {
      
      if (this._newSongToAdd() !== "") {

        this._songsList.update((currentSongsList: any[]) => {
          let newSongsList: any[] = [...currentSongsList]; // Fem DeepCopy perque signals comproven per referencia, d'aquesta manera tenim una referencia diferent llavors es un canvi 
          
          newSongsList.push({
            "songId": currentSongsList.length+1, // La id numerica de la nova cançó sera la llargada del array + 1, es com una clau auto incremental
            "title": this._newSongToAdd().title,
            "artist": this._newSongToAdd().artist,
            "favorite": false,  // Per defecte la cançó no sera favorita
            "mp3Url": this._newSongToAdd().mp3Url,
            "cover": this._newSongToAdd().cover,
            "description": this._newSongToAdd().description
          });

          localStorage.setItem("STORED_SONGS", JSON.stringify(newSongsList));

          return newSongsList;
        });
      }
    });

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
   this._idSongSelected = signal<number>(-1);
   this._regularPlus = signal<any>(faPlus).asReadonly();
   this._regularSearch = signal<any>(faMagnifyingGlass).asReadonly();

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

  public get idSongSelected(): Signal<number> {
    return this._idSongSelected.asReadonly();
  }

  public get plusIcon(): Signal<any> {
    return this._regularPlus;
  }

  public get searchIcon(): Signal<any> {
    return this._regularSearch;
  }

  public changeViewMode(mode: string): void {
    if (mode === "AddForm") this._idSongSelected.set(-1); // En cas que es vulgui obrir el AddForm, dexem de seleccionar la cançó seleccionada
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

  public handleClickSong(songId: number) {
    this.changeViewMode('Player');
    this._idSongSelected.set(songId);
    this._songToPlay.emit(this.getSongById(songId));
  }

  public getClassSong(songId: number): string {
    if (songId === this._idSongSelected()) return "song-item d-flex align-items-center my-3 fs-5 rounded-4 selected-song";
    else return "song-item text-white d-flex align-items-center my-3 fs-5 rounded-4";
  }

  public getSongById(songId: number): any {
    let songToReturn: any = "";
    let i: number = 0;
    let found: boolean = false;

    while (i < this._songsList().length && !found) {
      if(this._songsList()[i].songId === songId){
        songToReturn = this._songsList()[i];
        found = true;
      } 
      i++;
    }

    return songToReturn;
  }

}
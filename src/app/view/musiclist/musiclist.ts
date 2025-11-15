import { ChangeDetectionStrategy, Component, computed, effect, input, InputSignal, output, OutputEmitterRef, Signal, signal, untracked, WritableSignal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public _actualViewMode: InputSignal<string> = input<string>("General"); // Escolta sempre el estat actual de la web, ens servira posteriorment per si el mode es General o AddForm que deseleccioni la cançó actual, en cas que hagi alguna.
  public _saveLocalStorage: InputSignal<boolean> = input<boolean>(false);

  public _changeViewMode: OutputEmitterRef<string> = output();
  public _songToPlay: OutputEmitterRef<any> = output();
  public _updatedLocalStorage: OutputEmitterRef<void> = output();
  public _changeFavoriteStatusOnPlayer: OutputEmitterRef<number> = output();

  constructor() {
    // RECUPERACIÓ INICIAL DEL LOCAL STORAGE
    let storedSongsList = localStorage.getItem("STORED_SONGS");
    if (storedSongsList === null) this._songsList = signal<any>(SONGS);
    else this._songsList = signal<any[]>(JSON.parse(storedSongsList));

    // EFFECTS I COMPUTED
    effect(() => this.effectToAddNewSong()); // Effect per afegir cançons de AddForm
    effect(() => this.effectChangeSelectedIdByViewMode()); // Effect per controlar la cançó seleccionada depenent el Mode de vista
    effect(() => this.onSaveLocalStorage()); // Effect per desar la songList en LS
    this._shownSongsList = computed<any[]>(() => this.computedFilterListBySearch()); // Computed per construit la llista filtrada depenent la cerca
   
    // INICIALITZACIÓ DE VARIABLES
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

    if (songId === this._idSongSelected()) {
      this._changeFavoriteStatusOnPlayer.emit(songId);
    }
    
    localStorage.setItem("STORED_SONGS", JSON.stringify(this._songsList())); // Esta linea me la podria estalviar
  }

  /**
   * @param songId Id de la cançó seleccionada per l'usuari
   * 
   * Compara el songId amb la Id de la cançó seleccionada
   * Si els dos Id són diferents, el songId es seleccionara i es mostrara Player
   * En canvi, Si els dos Id són iguals, deselecciona la cançó actual.
   */
  public handleClickSong(songId: number): void {
    if (songId !== this._idSongSelected()) {
      this.changeViewMode('Player');
      this._idSongSelected.set(songId);
      console.log(this.getSongById(songId));
      this._songToPlay.emit(this.getSongById(songId));

    } else {
      this.changeViewMode('General');
      this._idSongSelected.set(songId);
    }
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

  public effectToAddNewSong(): void {
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
  }

  public effectChangeSelectedIdByViewMode(): void {
    if ((this._actualViewMode() === "General" || this._actualViewMode() === "AddForm") && this._idSongSelected() !== -1) {
      this._idSongSelected.set(-1); // Resetejem la cançó seleccionada per tal de que no es marqui en la llista
    }
  }

  public computedFilterListBySearch(): any[] {
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
  }

  public onSaveLocalStorage(): void {
    if (this._saveLocalStorage()) localStorage.setItem("STORED_SONGS", JSON.stringify(this._songsList()));

    this._updatedLocalStorage.emit(); // Avisem al pare que ja hem desat a LS
  }

}
import { ChangeDetectionStrategy, Component, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-addform',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './addform.html',
  styleUrl: './addform.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Addform {
  private _title: WritableSignal<string>;
  private _artist: WritableSignal<string>;
  private _mp3Url: WritableSignal<string>;
  private _cover: WritableSignal<string>;
  private _description: WritableSignal<string>;
  private _errorMessage: WritableSignal<string>;
  private _closeIcon: Signal<any>;
  
  public _changeViewMode: OutputEmitterRef<string> = output();
  public _songToSend: OutputEmitterRef<any> = output();

  constructor() {
    this._title = signal<string>("");
    this._artist = signal<string>("");
    this._mp3Url = signal<string>("");
    this._cover = signal<string>("");
    this._description = signal<string>("");
    this._errorMessage = signal<string>("");
    this._closeIcon = signal<any>(faX);
  }

  public get title(): WritableSignal<string> {
    return this._title;
  }

  public get artist(): WritableSignal<string> {
    return this._artist;
  }

  public get mp3Url(): WritableSignal<string> {
    return this._mp3Url;
  }

  public get cover(): WritableSignal<string> {
    return this._cover;
  }

  public get description(): WritableSignal<string> {
    return this._description;
  }

  public get errorMessage(): Signal<string> {
    return this._errorMessage.asReadonly();
  }

  public get closeIcon(): Signal<any> {
    return this._closeIcon;
  }

  public resetFormInputs(): void {
    this._title.set("");
    this._artist.set("");
    this._mp3Url.set("");
    this._cover.set("");
    this._description.set("");
  }

  public changeViewMode(mode: string): void {
    this.resetFormInputs();
    this._changeViewMode.emit(mode);
  }

  public addSongToList(): void {

    if(this.areInputsNotBlank()) {
      this._errorMessage.set("");
      let newSong: any = 
        {
          "title": this._title(),
          "artist": this.artist(),
          "mp3Url": this._mp3Url(),
          "cover": this._cover(),
          "description": this._description()
        };
      this.resetFormInputs();
      this._songToSend.emit(newSong);
    } else {
      this._errorMessage.set("No es pot introduir una cançó amb atributs buids");
    }
  }

  public areInputsNotBlank(): boolean {
    return this._title().length > 0 && 
           this._artist().length > 0 && 
           this._mp3Url().length > 0 && 
           this._cover().length > 0 && 
           this._description().length > 0;
  }
}

import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addform',
  imports: [FormsModule],
  templateUrl: './addform.html',
  styleUrl: './addform.css',
})

export class Addform {
  private _title: WritableSignal<string>;
  private _artist: WritableSignal<string>;
  private _mp3Url: WritableSignal<string>;
  private _cover: WritableSignal<string>;
  private _description: WritableSignal<string>;

  constructor() {
    this._title = signal<string>("");
    this._artist = signal<string>("");
    this._mp3Url = signal<string>("");
    this._cover = signal<string>("");
    this._description = signal<string>("");
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

  public mirar(): void{
    console.log(this._title);
  }
}

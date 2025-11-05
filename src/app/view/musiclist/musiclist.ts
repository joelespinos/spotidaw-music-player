import { Component, signal, WritableSignal } from '@angular/core';
import { SONGS } from '../../model/songs'

@Component({
  selector: 'app-musiclist',
  imports: [],
  templateUrl: './musiclist.html',
  styleUrl: './musiclist.css',
})

export class Musiclist {
  private _songsList: WritableSignal<any[]>;

  constructor() {
    this._songsList = signal<any[]>(SONGS);
  }

}

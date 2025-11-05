import { Component, signal } from '@angular/core';
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
  protected readonly title = signal('spotidaw-music-player');
}

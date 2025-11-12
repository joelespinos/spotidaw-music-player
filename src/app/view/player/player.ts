import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  public _songToPlay: InputSignal<any> = input<any>();
}

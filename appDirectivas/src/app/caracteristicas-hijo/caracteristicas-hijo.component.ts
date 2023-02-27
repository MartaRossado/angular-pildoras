import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-caracteristicas-hijo',
  templateUrl: './caracteristicas-hijo.component.html',
  styleUrls: ['./caracteristicas-hijo.component.css']
})
export class CaracteristicasHijoComponent {
  @Output() caracteristicasHijo = new EventEmitter<string>();

  agregaCaracteristicas(value: string){
    this.caracteristicasHijo.emit(value);
  }

}

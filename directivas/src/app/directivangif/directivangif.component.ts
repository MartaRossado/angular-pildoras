import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-directivangif',
  templateUrl: './directivangif.component.html',
  styleUrls: ['./directivangif.component.css']
})

export class DirectivangifComponent {
  title = 'DIRECTIVAS ngIf';
  mensaje ="";
  registrado=false;
  nombre:string= "";
  apellido:string= "";
  
  registrarUsuario(){
    this.registrado= true;
    this.mensaje = "Usuario registrado con éxito!";
  }

}

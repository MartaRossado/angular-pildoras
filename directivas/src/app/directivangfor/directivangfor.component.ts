import { Component } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-directivangfor',
  templateUrl: './directivangfor.component.html',
  styleUrls: ['./directivangfor.component.css']
})
export class DirectivangforComponent {
  entradas:object[];

  constructor(){
    this.entradas=[
      {titulo: "Python cada día más presente"},
      {titulo: "Java desde hace más de 20 años"},
      {titulo: "JavaScript cada día más funcional"},
      {titulo: "kotlin potencia para tus apps"},
      {titulo: "Donde quedó pascal?"}
    ]
  }

}

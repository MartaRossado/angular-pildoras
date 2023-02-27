import { Component } from '@angular/core';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
  // styles:["p{color:blue};"]
})
export class EmpleadoComponent {
  nombre = "Marta";
  edad = 33;
  movil = 0;
  empresa="PH";

  guardaMvl(value: string){
    this.movil = Number(value);
  }

  apagadoInput= true;

  checkMarcado= true;
  checkDeshabilitado= true;

  getRegistroUruario(){
  this.checkMarcado = true; //si lo paso a false lo desmarcaría
  }
  

  setRegistrarUsuario(){
    alert("El usuario se ha registrado correctamente.");
  }

  textoDeRegistro= "No estás registrado";
  setCambioTexto(){
    this.textoDeRegistro= "Si estás registrado";;
  }

  
  textoGenero= "...";
  setSelecionaGenero(event:any){
    this.textoGenero= `Eres ${event.target.value}`;  
  }

  // cambiaEmpresa(event:Event){
  //   this.empresa=(<HTMLInputElement>event.target).value
  // }





}

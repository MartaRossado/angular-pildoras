import { Component } from '@angular/core';
import { Empleado } from './empleado.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Listrado de Empleados';

  empleados:Empleado[]=[
    new Empleado("Juan","Diaz", "profesor", 40000),
    new Empleado("Ana","Martin", "administrativo", 30000),
    new Empleado("Maria","Lopez", "ingeniera", 60000),
    new Empleado("Jesus","Gomez", "abogado", 30000)
  ];
  cuadroNombre:string="";
  cuadroApellido:string="";
  cuadroCargo:string="";
  cuadroSalario:number=0;

  agregarEmpleado(){
    let miEmpleado= new Empleado(this.cuadroNombre, this.cuadroApellido, this.cuadroCargo, this.cuadroSalario);
    this.empleados.push(miEmpleado);

  }
}

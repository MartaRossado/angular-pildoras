import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Validaciones from '@shared/librerias/validaciones';
import { ListaResponse } from '@shared/modelos/lista/lista-response';
import { codigoSagValidator } from '@shared/validadores/ingenieria/sag/codigo-sag.validators';
import { RouteStateService } from '@shared/servicios/route-state.service';
import { SagFilter } from '@ingenieria/sag/modelos/sag/sag-filter.model';
import { SagRequest } from '@ingenieria/sag/modelos/sag/sag-request.model';
import { SagResponse } from '@ingenieria/sag/modelos/sag/sag-response.model';
import { SagTipo } from '@ingenieria/sag/modelos/sag/sag-tipo';
import { StateGestionSag } from '@ingenieria/sag/modelos/state-gestion-sag.model';
import { SagService } from '@ingenieria/sag/servicios/sag.service';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { GestionDate, GestionObjeto } from '@utiles/index';
import { FormularioDinamico } from '@shared/modulos/formulario-dinamico/models/field-config-type.interface';
import { FieldConfig } from '@shared/modulos/formulario-dinamico/models/field-config.interface';
import { FieldType } from '@shared/modulos/formulario-dinamico/models/field-type.enum';
import { BotonGenerico } from '@shared/modelos/layout-boton';
import { DynamicFormComponent } from '@shared/modulos/formulario-dinamico/containers/dynamic-form/dynamic-form.component';

/**
 * Componente generico para las criterios de selección en las pantallas de busqueda
 */
@Component({
  selector: 'gestion-sag',
  templateUrl: './gestion-sag.component.html',
  styleUrls: ['./gestion-sag.component.scss'],
  animations: [
    trigger('mostrarImagen', [
      state(
        'mostrar',
        style({
          display: 'block',
        })
      ),
      state(
        'ocultar',
        style({
          display: 'none',
        })
      ),
      transition('mostrar => ocultar', [style({ opacity: 1 }), animate(1000, style({ opacity: 0 }))]),
    ]),
  ],
})
export class GestionSagComponent implements AfterViewInit, OnInit, OnDestroy {
  formGestSag: FormularioDinamico<SagFilter> = null;
  public stateGestionSag: StateGestionSag;
  public leyendaIdentificacion = 'Identificación: ';
  public disabledInputIdentifier = false;
  public placeholderIdentifier = 'Identificador Sistema de Armas Genérico';
  public item: MenuItem = { label: this.translateService.translate('menu.sag.consulta'), url: '/ingenieria/sag/gestion' };

  public sagRequest: SagRequest = {
    codigo: '',
    cabeceraTecnica: 0,
    fechaInicioOperacion: null,
    soportaSistemasAutomatizados: false,
    coberturaSuministro: 0,
    codigoFabricantePrincipal: 0,
    codigoFabricante: '',
    configurado: false,
    denominacion: '',
    tipo: SagTipo.AERONAVE,
    codigoCabeceraTecnica: '',
  };

  public sagResponse: SagResponse = GestionObjeto.inicializarGenericoConValores(SagResponse, {
    id: 0,
    codigo: '',
    denominacion: '',
    codigoFabricantePrincipal: 0,
    codigoFabricante: '',
    tipo: SagTipo.AERONAVE,
    cabeceraTecnica: 0,
    codigoCabeceraTecnica: '',
    fechaInicioOperacion: GestionDate.getDateWithoutTime(),
    coberturaSuministro: 0,
    soportaSistemasAutomatizados: true,
    configurado: true,
  });

  /**
   * Filtro para la busqueda de SAGs
   */
  public filtro: SagFilter = {
    codigo: '',
    denominacion: '',
    page: 0,
    size: 5,
  };

  public existeSag = false;

  @ViewChild(DynamicFormComponent) formDefault: DynamicFormComponent;
  public mostrarImagen = true;

  public mostrarTab = false;
  private consultaObservable: Subscription;
  private controladorScroll: any;

  /**
   *  @ignore
   */
  constructor(
    private router: Router,
    public translateService: TranslocoService,
    public routerStateService: RouteStateService,

    public sagService: SagService,
    public renderer: Renderer2,
    public dialogService: DialogService,
    public formBuilder: FormBuilder
  ) {
    this.stateGestionSag = this.router?.getCurrentNavigation()?.extras.state as StateGestionSag;

    if (this.stateGestionSag == undefined) {
      this.stateGestionSag = { action: 'create', tipo: SagTipo.AERONAVE };
    } else {
      if (this.stateGestionSag.action == 'edit') {
        this.sagRequest.codigo = this.stateGestionSag.codigo;
      }
    }
  }
  obtenerFiltro() {
    return [
      [
        {
          type: FieldType.input,
          disabled: false,
          value: '',
          label: 'pages.sag.gestion.titulo',
          placeholder: 'Identificador Sistema de Armas Genérico',
          name: 'codigo',
          validation: [
            { validator: Validators.required, error: 'El Código del Sistema de Armas Genérico es obligatorio.', nameType: Validators.required.name },
            { validator: codigoSagValidator(), error: 'El formato del Código del Sistema de Armas Genérico es incorrecto.', nameType: 'invalidSag' },
          ],
          grid: 'input-field-c',
          ancho: 3,
          onkeyup: () => {
            const control = this.formGestSag.form.controls.codigo;
            control.setValue(String(control.value).toUpperCase());
          },
        },
        {
          type: FieldType.layoutButtons,
          layoutBotones: [
            {
              ...new BotonGenerico(),
              texto: 'Seleccionar',
              type: 'submit',
            },
          ],
          ancho: 2,
          name: '',
          grid: 'flex justify-content-end flex-grow-1',
        },
        {
          type: FieldType.empty,
          ancho: 7,
          grid: '',
        },
      ],
    ] as Array<FieldConfig[]>;
  }
  ngOnInit(): void {
    this.formGestSag = new FormularioDinamico(this.obtenerFiltro(), new SagFilter());
  }
  buscar($event: SagFilter) {
    this.consultaObservable = this.sagService.obtenerTodos($event).subscribe(
      (response: ListaResponse<SagResponse>) => {
        const edicion = this.stateGestionSag.action == 'edit';
        const creacion = !edicion;
        this.existeSag = response?.data?.some((value: SagResponse) => value.codigo == $event.codigo);
        if (this.existeSag) {
          this.disabledInputIdentifier = edicion;
          this.mostrarTab = edicion;
          if (edicion) {
            this.cargarSag(response?.data?.find((value: SagResponse) => value.codigo == $event.codigo));
          } else {
            this.formDefault.addDinamicValidators(['El Sistema de Armas Genérico ya existe.'], 'codigo');
          }
        } else {
          this.disabledInputIdentifier = creacion;
          this.mostrarTab = creacion;
          this.leyendaIdentificacion = 'Identificación: ' + (creacion ? $event.codigo : '');
          if (creacion) {
            this.formGestSag.form.controls.codigo.disable();
            this.formGestSag.config[0][1].layoutBotones[0].deshabilitado = true;
          } else {
            this.formDefault.addDinamicValidators(['El Sistema de Armas Genérico no existe.'], 'codigo');
          }
        }
      },
      (error: HttpErrorResponse) => {
        if (this.existeSag) {
          this.existeSag = false;
          this.disabledInputIdentifier = false;
          this.mostrarTab = true;
        }
      }
    );
  }

  /**
   * Fijamos el elemento con el foco activo en la pantalla
   */
  ngAfterViewInit() {
    if (this.sagRequest.codigo) {
      this.buscar(this.sagRequest);
    }
    this.metodoScroll();
  }

  /**
   * Recarga los datos de la pestaña general.
   */
  public actualizarDatosGeneral(): void {
    if (this.stateGestionSag.action == 'edit') {
      this.sagRequest.codigo = this.stateGestionSag.codigo;
    }
    this.buscar(this.sagRequest);
  }

  /**
   * Carga el response en el request de cara al alta/modificación
   * @param sag
   */
  private cargarSag(sag: SagResponse): void {
    //  Podría copiar los objetos con Object.assign({} , persona) (pero no copiaría los objetos correctamente)
    //  y no voy a usar JSON.parse y stringify para resolverlo
    //  Los copio a mano que así los tengo controlados

    this.leyendaIdentificacion = 'Identificación: ' + this.sagRequest.codigo;

    this.sagResponse = sag;
    if (this.sagRequest.codigo != this.sagResponse.codigo) {
      this.sagRequest.codigo = this.sagResponse.codigo;
    }

    this.sagRequest.denominacion = this.sagResponse.denominacion;
    this.sagRequest.cabeceraTecnica = this.sagResponse.cabeceraTecnica;
    this.sagRequest.codigoFabricantePrincipal = this.sagResponse.codigoFabricantePrincipal;
    this.sagRequest.fechaInicioOperacion = this.sagResponse.fechaInicioOperacion;
    this.sagRequest.coberturaSuministro = this.sagResponse.coberturaSuministro;
    this.sagRequest.soportaSistemasAutomatizados = this.sagResponse.soportaSistemasAutomatizados;
    this.sagRequest.configurado = this.sagResponse.configurado;
    this.sagRequest.tipo = this.sagResponse.tipo;
  }

  public metodoScroll(): void {
    this.controladorScroll = this.renderer.listen(window, 'wheel', (event) => {
      if (event.deltaY > 70) {
        this.mostrarImagen = false;
        this.controladorScroll();
      }
    });
  }

  ngOnDestroy() {
    if (this.consultaObservable !== undefined && this.consultaObservable !== null) {
      this.consultaObservable.unsubscribe();
    }
  }
}

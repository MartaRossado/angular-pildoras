import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@shared/servicios/toast.service';
import { EdcFilter } from '@ingenieria/sag/modelos/edc/edc-filter.model';
import { IndicadorTiempoCiclosFilter } from '@ingenieria/sag/modelos/indicador-tiempo-ciclos/indicador-tiempo-ciclos-filter.model';
import { IndicadorTiempoCiclosResponse } from '@ingenieria/sag/modelos/indicador-tiempo-ciclos/indicador-tiempo-ciclos-response.model';
import { EdcService } from '@ingenieria/sag/servicios/edc.service';
import { HuecosService } from '@ingenieria/sag/servicios/huecos.service';
import { IndicadorTiempoCiclosService } from '@apiComunes/servicios/indicador-tiempo-ciclos.service';
import { UnidadesSgtoVidaSagService } from '@ingenieria/sag/servicios/unidades-sgto-vida-sag.service';

import { ActualizarPagina } from '@shared/modelos/actualizar-pagina.model';
import { ListaResponse } from '@shared/modelos/lista/lista-response';
import { ModoDialogo } from '@shared/modelos/modo-dialogo';
import { OrderBy } from '@shared/modelos/order-by';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastSeverity } from '@shared/modelos/toast-severity';
import { UnidadesSgtoVidaResponse } from '@ingenieriaSag/modelos/unidades-seguimiento-vida/unidades-sgto-vida-response.model';
import { EdcResponse } from '@ingenieriaSag/modelos/edc/edc-response.model';
import { HuecosResponse } from '@ingenieriaSag/modelos/huecos/huecos-response.model';
import { Key } from '@shared/modelos/servicios/key.model';
import { UnidadesSgtoVidaRequest } from '@ingenieriaSag/modelos/unidades-seguimiento-vida/unidades-sgto-vida-request.model';
import { GestionObjeto, GestionString } from '@utiles/index';

/**
 * Dialogo de selección para unidades de seguimiento vida, creado con primeNG
 *
 * {@link https://www.primefaces.org/primeng/showcase/#/dynamicdialog Dialog Service}
 */
@Component({
  selector: 'dialogo-unidades-sgto-vida-gestion-sag',
  templateUrl: './dialogo-unidades-sgto-vida-gestion-sag.component.html',
  styleUrls: ['./dialogo-unidades-sgto-vida-gestion-sag.component.scss'],
})
export class DialogoUnidadesSgtoVidaSagComponent implements OnInit {
  /**
   * Formulario de alta/modificacion de unidades seguimiento vida
   */
  formAltaModificacion: FormGroup;

  /**
   * Modo del dialogo pasado al dialogo en el config.data
   */
  modoDialogo: ModoDialogo;

  // Modo del dialogo para el html
  modoDialogoCrear = ModoDialogo.Alta;
  modoDialogoModificacion = ModoDialogo.Modificacion;
  modoDialogoBaja = ModoDialogo.Baja;

  /**
   * Elemento para el componene borrar
   */
  elemento: string = 'el Seguimiento de Vida';

  /**
   * Mensaje de error de campo obligatorio
   */
  campoObligatorioMensaje: string = 'Este campo es obligatorio';

  /**
   * Boolean para habilitar el botón de edición o creacion
   */
  habilitarAccion: boolean = false;

  /**
   * Booleanos para mostrar los mensajes de validacion
   */
  mostrarMnsjValidacionTiempoCiclos: boolean = false;
  mostrarMnsjValidacionHoras: boolean = false;

  /**
   * Booleanos para mostrar los mensajes de validacion de Autocompletes
   */
  tiempoCiclosEsObjeto: boolean = false;

  horasVueloEsUnDecimal: boolean = false;

  inputIndicadoresId: string = 'input-indicadores';
  inputHorasVueloId: string = 'input-horas-vuelo';
  inputIecId: string = 'input-iec';
  inputEdcId: string = 'input-edc';

  /**
   * Unidad seguimiento vida pasado al dialogo en el config.data
   */
  unidadesSgtoVida: UnidadesSgtoVidaResponse = new UnidadesSgtoVidaResponse();

  /**
   * Lista de Indicadores de Tiempo ciclos
   */
  indicadoresTiempoCiclosList: IndicadorTiempoCiclosResponse[] = [];

  /**
   * Lista de Edc
   */
  public edcList: EdcResponse[];
  public edcResponse: EdcResponse = new EdcResponse();

  /**
   * Lista de huecos
   */
  huecosList: HuecosResponse[] = [];
  huecoResponse: HuecosResponse = new HuecosResponse();
  huecosListBk: HuecosResponse[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private unidadesSgtoVidaService: UnidadesSgtoVidaSagService,

    private indicadoresTiempoCicloService: IndicadorTiempoCiclosService,
    private huecosService: HuecosService,
    private edcService: EdcService,
    private toastService: ToastService
  ) {}

  /**
   * @ignore
   */
  ngOnInit() {
    this.modoDialogo = this.config.data.modoDialogo;
    this.unidadesSgtoVida = GestionObjeto.clonarObjeto(this.config.data.unidadSgtoVida);

    this.inicializarFormulario();
  }

  /**
   * ########## INICIAR FORMULARIO ##########
   */

  /**
   * Inicializa el formulario: controles, validaciones, disabled ...
   */
  private inicializarFormulario(): void {
    if (this.modoDialogo !== this.modoDialogoBaja) {
      this.formAltaModificacion = new FormGroup({
        indicadorTiempoCiclos: new FormControl('', [Validators.required]),
        factorConversion: new FormControl('', [Validators.required]),
        edc: new FormControl(''),
        variante: new FormControl(''),
        iec: new FormControl(''),
        sistemaAutomatizado: new FormControl(''),
        descripcion: new FormControl(''),
      });

      if (this.modoDialogo === this.modoDialogoModificacion) {
        this.formAltaModificacion.controls.indicadorTiempoCiclos.disable();
        this.formAltaModificacion.controls.factorConversion.disable();
        this.formAltaModificacion.controls.edc.disable();
        this.formAltaModificacion.controls.iec.disable();
      }

      this.formAltaModificacion.controls.variante.disable();
      this.formAltaModificacion.controls.iec.disable();
      this.formAltaModificacion.controls.descripcion.disable();

      this.edcResponse = this.unidadesSgtoVida.huecosResponse.edcResponse;
      this.huecoResponse = this.unidadesSgtoVida.huecosResponse;

      this.formAltaModificacion.controls.edc.valueChanges.subscribe((value) => {
        this.edcAutocompleteValueChange(value);
      });

      this.formAltaModificacion.controls.iec.valueChanges.subscribe((value) => {
        if (value instanceof Object && value.id != 0) {
        } else if (value.id != 0) {
          let HuecosResponse: HuecosResponse = this.unidadesSgtoVida.huecosResponse;
          HuecosResponse.posicion = value;
          HuecosResponse.descripcionIec = '';
          this.formAltaModificacion.controls.iec.setValue(this.unidadesSgtoVida.huecosResponse);
        }
      });

      this.formAltaModificacion.controls.indicadorTiempoCiclos.valueChanges.subscribe((value) => {
        this.tiempoCiclosEsObjeto = value instanceof Object && value.id != 0;
      });
    }
  }

  /**
   * Método uqe evalua el cambio de el autocomplete de IEC
   */
  edcAutocompleteValueChange(value: any) {
    if (value instanceof Object && value.id != 0) {
      this.huecosList = [];
      this.huecosListBk = [];

      if (value.huecos.length > 0) {
        this.rellenarListaDeHuecos(value);
      } else {
        this.borrarYDeshabilitarCamposHueco();

        // Si el IEC no tiene huecos se mostrará un mensaje
        if (value.variante != '') {
          let summary = GestionString.concatenarStrings(['El IEC ', value.iec, ' no tiene ningun hueco asociado']);
          this.toastService.addSingle(ToastSeverity.Advertencia, summary, '', false);
        }
      }
    } else {
      if (value.id != 0) {
        let edcResponse: EdcResponse = this.unidadesSgtoVida.huecosResponse.edcResponse;
        //let EdcResponse = this.edcService.obtenerFilaVacia();
        edcResponse.iec = value;
        edcResponse.variante = '';
        this.formAltaModificacion.controls.edc.setValue(this.unidadesSgtoVida.huecosResponse.edcResponse);

        this.borrarYDeshabilitarCamposHueco();
      }
    }
  }

  rellenarListaDeHuecos(value: EdcResponse) {
    if (this.modoDialogo !== this.modoDialogoModificacion) {
      this.formAltaModificacion.controls.iec.enable();
    }

    value.huecos.forEach((huecoId) => {
      this.huecosService.obtener({ id: huecoId }).subscribe((huecosResponse: HuecosResponse) => {
        if (null != huecosResponse) {
          let hueco: HuecosResponse = huecosResponse;

          hueco.descripcionIec = GestionString.concatenarStrings([value.nombreEspanol, ' / ', hueco.descripcion]);

          this.huecosList.push(hueco);
          this.huecosListBk.push(hueco);
        }
      });
    });
  }

  borrarYDeshabilitarCamposHueco() {
    this.unidadesSgtoVida.huecosResponse.edcResponse.idEdcHueco = 0;
    this.formAltaModificacion.controls.iec.disable();
  }

  /**
   * ########## LLAMADAS AL BACK ##########
   */

  /**
   * Ejecuta una de las acciones del modal: crear, modificar o borrar ...
   */
  hacerAccion() {
    if (this.modoDialogo === this.modoDialogoBaja || (this.formAltaModificacion.valid && this.validacionAutocompletes())) {
      const unidadesSgtoVidaKey: Key = {
        idPadre: this.unidadesSgtoVida.idPadre,
        id: this.modoDialogo == ModoDialogo.Alta ? undefined : this.unidadesSgtoVida.id,
      };

      const unidadesSgtoVidaRequest: UnidadesSgtoVidaRequest = {
        id: this.modoDialogo == ModoDialogo.Alta ? undefined : this.unidadesSgtoVida.id,
        indicadorTiempoCiclos: this.unidadesSgtoVida.indicadorTiempoCiclosResponse.id,
        factorConversion: this.unidadesSgtoVida.factorConversion,
        sistemasAutomatizados: this.unidadesSgtoVida.sistemasAutomatizados ? true : false,
        hueco: this.huecoResponse.id ?? null,
        fechaBaja: this.unidadesSgtoVida.fechaBaja,
      };

      this.llamarAServicioRest(unidadesSgtoVidaKey, unidadesSgtoVidaRequest);
    } else {
      this.mostrarMensajesValidacion();
    }
  }

  /**
   * Llamada al servicio: crear, modificar o borrar ...
   */
  llamarAServicioRest(unidadesSgtoVidaKey: Key, unidadesSgtoVidaRequest: UnidadesSgtoVidaRequest) {
    switch (this.modoDialogo) {
      case ModoDialogo.Alta:
        this.unidadesSgtoVidaService.crear(unidadesSgtoVidaRequest, unidadesSgtoVidaKey).subscribe(
          (response: UnidadesSgtoVidaResponse) => {
            this.cerrarConRefresh();
          },
          (error) => {}
        );
        break;
      case ModoDialogo.Modificacion:
        this.unidadesSgtoVidaService.modificar(unidadesSgtoVidaKey, unidadesSgtoVidaRequest).subscribe(
          (response: UnidadesSgtoVidaResponse) => {
            this.cerrarConRefresh();
          },
          (error) => {}
        );
        break;
      case ModoDialogo.Baja:
        this.unidadesSgtoVidaService.eliminar(unidadesSgtoVidaKey).subscribe(
          (response: UnidadesSgtoVidaResponse) => {
            this.cerrarConRefresh();
          },
          (error) => {}
        );
        break;
      default:
        break;
    }
  }

  /**
   * ########## CERRAR DIALOGO ##########
   */

  /**
   * Cierra el dialogo pasando un objeto
   */
  cerrarConRefresh() {
    let response: ActualizarPagina<UnidadesSgtoVidaResponse> = {
      actualizar: true,
      elemento: this.unidadesSgtoVida,
    };

    this.ref.close(response);
  }

  /**
   * Cierra el dialogo
   */
  cancelar() {
    this.ref.close();
  }

  /**
   * ########## BUSQUEDAS EN AUTOCOMPLETES ##########
   */

  /**
   * Realiza la busqueda del indicador para el autocomplete
   */
  public buscarIndicador($event: any): void {
    let filtro: IndicadorTiempoCiclosFilter = {
      descripcion: $event.query,
      orderBy: 'descripcion',
      orderDirection: OrderBy.ASC,
    };

    this.indicadoresTiempoCicloService.obtenerTodos(filtro).subscribe((response: ListaResponse<IndicadorTiempoCiclosResponse>) => {
      this.indicadoresTiempoCiclosList = response.data;
    });
  }

  /**
   * Realiza la busqueda del hueco para el autocomplete
   */
  public buscarHueco($event: any): void {
    this.huecosList = GestionObjeto.clonarObjeto(this.huecosListBk.filter((hueco) => GestionString.contieneSubstring(hueco.descripcionIec, $event.query)));
  }

  /**
   * Realiza la busqueda del hueco para el autocomplete
   */
  public buscarEdc($event: any): void {
    let filtro: EdcFilter = {
      iec: $event.query,
      orderBy: 'iec',
      orderDirection: OrderBy.ASC,
    };

    this.edcService.obtenerTodos(filtro).subscribe((response: ListaResponse<EdcResponse>) => {
      /*response.data.forEach( edc => {
                edc.huecoEdc = new HuecosResponse();
            });*/

      this.edcList = response.data;
    });
  }

  /**
   * ########## VALIDACIONES ##########
   */

  public validacionAutocompletes(): boolean {
    return this.tiempoCiclosEsObjeto;
  }

  /**
   * Muestra todos los posibles mensajes de validación del formulario
   */
  public mostrarMensajesValidacion() {
    this.mostrarMnsjValidacionTiempoCiclos = true;
    this.mostrarMnsjValidacionHoras = true;
  }

  /**
   * Muestra el mensaje de validación un input concreto del formulario
   */
  public onFocusOutEvent(event: any) {
    switch (event.target.id) {
      case this.inputIndicadoresId:
        this.mostrarMnsjValidacionTiempoCiclos = true;
        break;
      case this.inputHorasVueloId:
        this.mostrarMnsjValidacionHoras = true;
        break;
      default:
    }
  }
}

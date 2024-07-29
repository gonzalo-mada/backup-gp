import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Usuario } from 'src/app/base/models/usuario';
import { PortalService } from 'src/app/base/services/portal.service';
import { SystemService } from 'src/app/base/services/system.service';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { EmptyValidator } from 'src/app/base/tools/validators/empty.validator';
import { RutValidator } from 'src/app/base/tools/validators/rut.validator';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private systemService: SystemService,
    private portalService: PortalService,
    private errorTemplateHandler: ErrorTemplateHandler,
    private messageService: MessageService,
  ) {}

  @Output() onOpen = new EventEmitter();
  show: boolean = false;

  usuario: Usuario = this.usuarioService.getUserOnline();
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.setForm();
  }

  showContacto(): void {
    this.show = true;
    this.onOpen.emit();
  }

  async sendMail(): Promise<void> {
    var t: any = await this.systemService.translate([
      'ayuda.contacto.titulo',
      'ayuda.contacto.confirm',
      'ayuda.contacto.success',
      'ayuda.contacto.error',
    ]);

    this.confirmationService.confirm({
      icon: `pi pi-envelope`,
      message: t['ayuda.contacto.confirm'],
      rejectButtonStyleClass: 'p-button-secondary',
      key: 'contacto',
      accept: async () => {
        try {
          var data = this.form.getRawValue();
          await this.portalService.sendContactMail(
            data.mensaje,
            data.correo,
            data.nombre,
            data.rut,
            this.systemService.getSitename(),
          );

          this.show = false;
          this.form = this.setForm();
          this.messageService.add({
            key: 'main',
            summary: t['ayuda.contacto.titulo'],
            detail: t['ayuda.contacto.success'],
            severity: 'success',
          });
        } catch (e) {
          this.errorTemplateHandler.processError(e, {
            notifyMethod: 'alert',
            summary: t['ayuda.contacto.titulo'],
            message: t['ayuda.contacto.error'],
          });
        }
      },
    });
  }

  private setForm(): FormGroup {
    return new FormBuilder().group({
      rut: !this.usuario.anonimo
        ? new FormControl<string>({
            value: this.usuario.rut,
            disabled: true,
          })
        : new FormControl<string>('', [
            Validators.required,
            EmptyValidator.empty,
            RutValidator.rut,
          ]),
      correo: new FormControl<string>(
        !this.usuario.anonimo ? this.usuario.correo_uv : '',
        [Validators.required, Validators.email, EmptyValidator.empty],
      ),
      nombre: !this.usuario.anonimo
        ? new FormControl<string>({
            value: this.usuario.nombre_completo,
            disabled: true,
          })
        : new FormControl<string>('', [
            Validators.required,
            EmptyValidator.empty,
          ]),
      mensaje: new FormControl<string>('', [
        Validators.required,
        EmptyValidator.empty,
      ]),
    });
  }
}

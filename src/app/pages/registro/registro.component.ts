import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: Usuario;

  recordar = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new Usuario();
  }

  public onSubmit( form: NgForm) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'

    });
    Swal.showLoading();
    this.router.navigateByUrl('/home');

    console.log('posteo de formulario');
    console.log({'usuario-form': this.usuario});
    console.log(form);

    this.auth.registrarNuevoUsuario(this.usuario)
    .subscribe(resp => {
      console.log('registro usuario firebase', resp);
      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email', this.usuario.email);
      } else {
        localStorage.removeItem('email');
      }

    }, err => {
      console.error(err.error.error.message);

      Swal.fire({
        allowOutsideClick: false,
        title: 'Error al registrar un usuario',
        icon: 'error',
        text: err.error.error.message
  
      });

    });
  }


}

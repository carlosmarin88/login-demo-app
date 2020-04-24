import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { text } from '@angular/core/src/render3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  recordar = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new Usuario();

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }

  }

  public login(form: NgForm) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      // el popup no se puede cerrar si hace click fuera de la ventana
      allowOutsideClick: false,
      icon : 'info',
      text: 'Espere por favor...'

    });
    Swal.showLoading();

    console.log(this.usuario);
    console.log('se imprime el form', form);

    this.auth.logIn(this.usuario)
    .subscribe(resp => {
      console.log(resp);
      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('home');

    }, err => {
      console.log(err.error.error.message);

      Swal.fire({
        allowOutsideClick: true,
        icon: 'error',
        title : 'Error al autenticar',
        text: err.error.error.message

      });

    });
    
  }

}

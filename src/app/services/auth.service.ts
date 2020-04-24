import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private url = 'https://identitytoolkit.googleapis.com/v1/';

private apiKey = 'AIzaSyAwPspw6JEPoZShJhTlvB2ndIj54Fjbj8s';

private userToken: string;

// crear nuevo usuario
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

// login

// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  public logOut() {
    localStorage.removeItem('token');
  }

  public logIn( usuario: Usuario) {

    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}accounts:signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['idToken']);
      })
    );

  }

  public registrarNuevoUsuario(usuario: Usuario) {

    /* 1ra forma
    const authData = {
      email : usuario.email,
      password : usuario.password,
      returnSecureToken: true,
    }
    */
   /* 2da forma: enviar el usuario como sinonimo se agrega el campo nombre solamente de mas */
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}accounts:signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['idToken']);
      })
    );

  }

  public guardarToken( idToken: string ) {

      localStorage.setItem('token', idToken);
      this.userToken = idToken;
      const hoy = new Date();
      hoy.setSeconds(3600);
      localStorage.setItem('expira', hoy.getTime().toString());

  }

  public leerToken() {
    if ( localStorage.getItem('token') ) {
        this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  public esAutenticado(): boolean {
    if ( this.userToken.length > 2)  {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    }
    localStorage.removeItem('expira');
    return false;

  }
}

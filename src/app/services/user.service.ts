import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

  constructor(private _http: HttpClient) { }

  register(body: any) {
    return this._http.post(environment.baseurl + '/users/register', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  registerAdmin(body: any){
    return this._http.post(environment.baseurl + '/users/registerAdmin', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  removeUser(id: any) {
    return this._http.post(environment.baseurl + '/users/removeUser', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      params: {
        id
      }
    });
  }

  login(body: any) {
    return this._http.post(environment.baseurl + '/users/login', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
    });
  }

  user() {
    return this._http.get(environment.baseurl + '/users/user', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true
    });
  }

  listOfUsers() {
    return this._http.get(environment.baseurl + '/users/listofusers', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true
    });
  }

  addfriend(id:any, friendUsername:string) {
    return this._http.get(environment.baseurl + '/users/addfriend', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
      params: {
        id,
        friendUsername
      }
    });
  }

  removefriend(id: any, friendUsername: string) {
    return this._http.get(environment.baseurl + '/users/removefriend', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
      params: {
        id,
        friendUsername
      }
    });
  }

  logout() {
    return this._http.get(environment.baseurl + '/users/logout', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true
    });
  }

  updatePic(id: any, value: string) {
    return this._http.get(environment.baseurl + '/users/updatepic', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
      params: {
        id,
        value
      }
    });
  }

  editProfile(body: any) {
    return this._http.post(environment.baseurl + '/users/editprofile', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true
    });
  }

  updatePassword(id: any, newpass: string) {
    return this._http.get(environment.baseurl + '/users/updatepassword', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
      params: {
        id,
        newpass
      }
    });
  }

  verifyPassword(password: string, newpass: string, confnewpass: string, id: any) {
    return this._http.get(environment.baseurl + '/users/verifypassword', {
      observe: 'response',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      withCredentials: true,
      params: {
        password,
        newpass,
        confnewpass,
        id
      }
    });
  }
}

import { Injectable, OnInit, EventEmitter } from '@angular/core';

import { environment } from '../environments/environment';

import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  serviceURL: string = environment.appBaseUrl;
  constructor(private _http: HttpClient ) { }

  getValues() {
    const url = `${this.serviceURL}/api/values`;
    const service = this._http
      .get(url);
      //
    return service;
  }
}



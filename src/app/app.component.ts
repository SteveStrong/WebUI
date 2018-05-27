import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  serviceURL: string = environment.appBaseUrl;
  title = 'WebUI';
  url = `${this.serviceURL}/api/values`;
  values = {};

  constructor(private _service: MessageService) {}

  ngOnInit() {
    this._service.getValues().subscribe(item => {
      this.values = item;
    });
  }
}

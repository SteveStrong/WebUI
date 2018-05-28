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
  url = `${this.serviceURL}`;
  values = {};
  repos = {};

  constructor(private _service: MessageService) {}

  ngOnInit() {
    this._service.getValues().subscribe(item => {
      this.values = item;
    });

    this._service.getRepos().subscribe(item => {
      this.repos = item;
    });
  }
}

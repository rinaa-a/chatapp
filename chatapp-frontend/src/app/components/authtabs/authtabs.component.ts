import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'app-authtabs',
  templateUrl: './authtabs.component.html',
  styleUrls: ['./authtabs.component.css']
})
export class AuthtabsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
  }

}

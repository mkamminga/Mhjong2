
import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component, Injectable} from '@angular/core';
import { UserService } from '../services/UserService';

@Component({
  template: `<h2>Login</h2> <div *ngIf="getError() != ''" class="alert-box round alert">{{ getError()}}</div> <div *ngIf="getError() == ''" class="callout success">Userdata is set!</div>`,
})
export class LoginComponent implements OnInit { 
    private username:string = "";
    private error:string = "";

    constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params.hasOwnProperty('username') && params.hasOwnProperty('token'))
            {
              console.log("LoginComponent > ngOnInit: User details set username => "+ params['username'] + ", token => "+ params["token"]);
              this.userService.setLoggedInWithAuthenticationData(params['username'], params["token"]);
            }
            else
            {
              console.log("LoginComponent > ngOnInit: error, data missing!");
              this.error = "Missing data!";
            }
        });
    }

    getError (): string
    {
      return this.error;
    }
}
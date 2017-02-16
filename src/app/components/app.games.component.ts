import {Component, Injectable} from '@angular/core';
import { UserService } from '../services/UserService';

@Component({
  moduleId: module.id, // for relative to current Component load paths
  templateUrl: '../views/games.overview.html',
})

@Injectable()
export class GamesComponent { 
  constructor(private userService: UserService)
  {

  }

  isLoggedIn(): boolean
  {
    return this.userService.isLoggedIn();
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  socket: any;
  users = [];
  loggedInUser: any;
  userArray = [];
  onlineUsers = [];

  constructor(private usersService: UsersService, private tokenService: TokenService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.loggedInUser = this.tokenService.GetPayload();
    this.getUsers();
    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUsers();
      this.getUser();
    });
  }

  getUsers() {
    this.usersService.getAllUsers().subscribe(data => {
      _.remove(data.result, {username: this.loggedInUser.username});
      this.users = data.result;
    })
  }

  getUser() {
    this.usersService.getUserById(this.loggedInUser._id).subscribe(data => {
      this.userArray = data.result.following;
    })
  }

  followUser(user) {
    this.usersService.followUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  checkInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if(result) {
      return true;
    } else {
      return false;
    }
  }

  online(event) {
    this.onlineUsers = event;
  }

  CheckIfOnline(name){
    const result = _.indexOf(this.onlineUsers, name);
    if(result > -1) {
      return true;
    } else {
      return false;
    }
  }

}

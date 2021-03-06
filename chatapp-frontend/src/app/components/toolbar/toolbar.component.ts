import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment/moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications = [];
  socket: any;
  count = [];
  chatList = [];
  msgNumber = 0;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usersService: UsersService,
    private msgService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online', { room: 'global', user: this.user.username });

    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.result.chatList;
        this.checkIfRead(this.chatList);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.DeleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  checkIfRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.senderName}`) {
        if (receiver.isRead === false && receiver.receiverName === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  MarkAll() {
    this.usersService.MarkAllAsRead().subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  logout() {
    this.tokenService.DeleteToken();
    this.router.navigate(['/']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GoToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.msgService.MarkMessages(this.user.username, name).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  MarkAllMessages() {
    this.msgService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  messageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data);
    });
  }
}

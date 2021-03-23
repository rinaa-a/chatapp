import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  socket: any;

  commentForm: FormGroup;
  postId: any;
  commentsArray = [];
  post: String;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');

    this.init();

    this.getPost();
    this.socket.on('refreshPage', (data) => {
      this.getPost();
    })
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  addComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {});
      this.commentForm.reset();
    })
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      this.commentsArray = data.post.comments.reverse();
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

}

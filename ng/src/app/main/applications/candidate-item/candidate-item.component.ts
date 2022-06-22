import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/main/users/models/user.model';
import { UserApplication } from '../models/user-application.model';

@Component({
  selector: 'app-candidate-item',
  templateUrl: './candidate-item.component.html',
  styleUrls: ['./candidate-item.component.scss']
})
export class CandidateItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() userApplication!: UserApplication;

  @Output() Accepted: EventEmitter<UserApplication> = new EventEmitter<UserApplication>();
  @Output() Declined: EventEmitter<UserApplication> = new EventEmitter<UserApplication>();

  onAccept(): void {
    this.Accepted.emit(this.userApplication);
  }

  onDecline(): void {
    this.Declined.emit(this.userApplication);
  }

  checkApproved(): boolean{
    if (this.userApplication.approved)
      return true;
    return false;
  }

  checkRejected(): boolean{
    if(this.userApplication.rejected)
      return  true;
    return false;
  }

}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

declare let $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // handling events
  public today = new Date();
  public tomorrow1 = new Date();
  public tomorrow2 = new Date();
  public tomorrow3 = new Date();
  public day1: string;
  public day2: string;
  public day3: string;
  public day4: string;
  array1 = [];
  array2 = [];
  array3 = [];
  array4 = [];
  user;

  // modals
  public currentEvent: string;
  public eventDate: string;
  public eventStart: string;
  public eventEnd: string;
  public eventDescription: string;

  constructor(
    private _eventService: EventService,
    private _router: Router,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.tomorrow1.setTime(this.today.getTime() + 1 * 86400000);
    this.tomorrow2.setTime(this.today.getTime() + 2 * 86400000);
    this.tomorrow3.setTime(this.today.getTime() + 3 * 86400000);

    this.day1 = this.transformDayOfWeek(this.today.getDay());
    this.day2 = this.transformDayOfWeek(this.tomorrow1.getDay());
    this.day3 = this.transformDayOfWeek(this.tomorrow2.getDay());
    this.day4 = this.transformDayOfWeek(this.tomorrow3.getDay());

    this.user = sessionStorage.getItem('activeUser');
    this._eventService.eventPuller().subscribe(
      (data) => {
        // console.log('Events: ' + data);
        this.addEventsFromDB(data);
        this.array1 = this.sortArrayAsc(this.array1, 'startTime');
        this.array2 = this.sortArrayAsc(this.array2, 'startTime');
        this.array3 = this.sortArrayAsc(this.array3, 'startTime');
        this.array4 = this.sortArrayAsc(this.array4, 'startTime');
      },
      (error) => {
        console.log('Nothing is being returned yet');
      }
    );

    console.log(this.array1);
  }

  sortArrayAsc(arr, key) {
    return arr.sort((a, b) => a[key] - b[key]);
  }

  transformDayOfWeek(num) {
    if (num == 0) {
      return 'SUNDAY';
    }
    if (num == 1) {
      return 'MONDAY';
    }
    if (num == 2) {
      return 'TUESDAY';
    }
    if (num == 3) {
      return 'WEDNESDAY';
    }
    if (num == 4) {
      return 'THURSDAY';
    }
    if (num == 5) {
      return 'FRIDAY';
    }
    if (num == 6) {
      return 'SATURDAY';
    }
  }

  addEventsFromDB(data) {
    data.forEach((event) => {
      const eventDate = new Date(event.date);
      eventDate.setTime(eventDate.getTime() + 1 * 86400000); // the date has to be incremented by one to be correct
      const now = new Date();

      if (eventDate.getDate() === now.getDate()) {
        this.array1.push(event);
      }
      if (eventDate.getDate() === this.tomorrow1.getDate()) {
        this.array2.push(event);
      }
      if (eventDate.getDate() === this.tomorrow2.getDate()) {
        this.array3.push(event);
      }
      if (eventDate.getDate() === this.tomorrow3.getDate()) {
        this.array4.push(event);
      }
    });
  }

  convertDateToCST(date) {
    return date.toLocaleString('en-US', { timeZone: 'America/Chicago' });
  }

  // TODO: Are events ever not going to be on the hour?
  formatTime(time) {
    const newTime = time - 12;
    return `${newTime}:00 pm`;
  }

  displayModal(event) {
    const date = new Date(event.date);
    this.user = sessionStorage.getItem('activeUser');

    this.eventDate = `${
      date.getUTCMonth() + 1
    }/${date.getUTCDate()}/${date.getUTCFullYear()}`;
    this.currentEvent = event.eventTitle;

    if (event.startTime > 12) {
      this.eventStart = this.formatTime(event.startTime);
    } else {
      this.eventStart = `${event.startTime}:00 am`;
    }
    if (event.endTime > 12) {
      this.eventEnd = this.formatTime(event.endTime);
    } else {
      this.eventEnd = `${event.endTime}:00 am`;
    }

    this.eventDescription = event.description;
    $('#eventModal').modal('show');
  }

  hideModal() {
    $('#eventModal .close').click();
  }
}

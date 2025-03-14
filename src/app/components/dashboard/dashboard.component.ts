import { Component, OnInit } from '@angular/core';
import { HeadingComponent } from '../heading/heading.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [HeadingComponent],
})
export class DashboardComponent implements OnInit {
  title: string = 'Головна';

  constructor() {}

  ngOnInit() {}
}

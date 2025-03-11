import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  imports: [MaterialModule],
})
export class HeadingComponent implements OnInit {
  @Input() title = '';
  @Input() refreshIcon: boolean = false;

  constructor() {}

  ngOnInit() {}

  public refresh(): void {}
}

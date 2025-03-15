import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  public handleRefresh(): void {
    this.refresh.emit(true);
  }
}

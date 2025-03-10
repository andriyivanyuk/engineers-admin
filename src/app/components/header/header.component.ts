import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class HeaderComponent implements OnInit {
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSidebarCollapsed: boolean = false;

  constructor() {}

  ngOnInit() {}

  public onSidebarToggle(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.collapsed.emit(this.isSidebarCollapsed);
  }
}

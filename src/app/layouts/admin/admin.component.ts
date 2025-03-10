import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [SidenavComponent, RouterOutlet, CommonModule, HeaderComponent],
})
export class AdminComponent implements OnInit {
  isSidebarCollapsed: boolean = false;

  constructor() {}

  ngOnInit() {}

  public handleCollapsed(event: boolean) {
    this.isSidebarCollapsed = event;
  }
}

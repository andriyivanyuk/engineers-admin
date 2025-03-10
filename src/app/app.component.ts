import { Component } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [SidenavComponent, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { trigger, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { TokenStorageService } from '../../services/token-storage.service';
import { MenuItem } from './menuItem';
import { menuItems } from './navData';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [RouterLink, RouterLinkActive, CommonModule, MaterialModule],
  animations: [
    trigger('submenuAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
  providers: [TokenStorageService],
})
export class SidenavComponent implements OnInit {
  isSidebarCollapsed = input<boolean>(false);
  menuItems: MenuItem[] = [];

  readonly router = inject(Router);
  readonly tokenStorage = inject(TokenStorageService);

  constructor() {}

  public toggleMenuItem(item: MenuItem) {
    if (!this.isSidebarCollapsed() && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  public signOut() {
    this.tokenStorage.clearToken();
    this.router.navigate(['/authentication/login']);
  }

  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.mapMenuItems();
  }

  public mapMenuItems(): void {
    const user = this.tokenStorage.getUserSession();
    let result;
    if (user.role === 'superadmin') {
      result = menuItems.filter((item) => item.label === 'Доступ');
    } else {
      result = menuItems.filter((item) => item.label !== 'Доступ');
    }
    if (result) {
      this.menuItems = result;
    }
  }
}

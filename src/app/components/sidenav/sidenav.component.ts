import { RouterLink } from '@angular/router';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { trigger, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
// import { DeleteProductComponent } from '../dialogs/delete-product/delete-product.component';

interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  route?: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [RouterLink, CommonModule, MaterialModule],
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
})
export class SidenavComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      icon: 'fal fa-home fa-2xl',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'fal fa-list fa-2xl',
      label: 'Manage categories',
      isOpen: false,
      children: [
        {
          icon: 'fal fa-chart-pie',
          label: 'Analytics',
          route: '',
        },
        {
          icon: 'fal fa-tasks',
          label: 'Projects',
          route: '',
        },
      ],
    },
    {
      icon: 'fal fa-briefcase fa-2xl',
      label: 'Manage Products',
      isOpen: false,
      children: [
        {
          icon: 'fal fa-lock',
          label: 'Product List',
          route: '',
        },
        {
          icon: 'fal fa-user',
          label: 'Create Product',
          route: 'create-product',
        },
        {
          icon: 'fal fa-lock',
          label: 'Security',
          route: '',
        },
      ],
    },
  ];

  public toggleSidebar() {
    this.sidebarToggle.emit();
  }

  public toggleMenuItem(item: MenuItem) {
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  // public openDialog(): void {
  //   const dialogRef = this.dialog.open(DeleteProductComponent, {
  //     data: { name: this.name(), animal: this.animal() },
  //     width: '450px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //     if (result !== undefined) {
  //       this.animal.set(result);
  //     }
  //   });
  // }
}

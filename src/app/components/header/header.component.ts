import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TokenStorageService } from '../../services/token-storage.service';
import { User } from '../../pages/authentication/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MaterialModule],
  providers: [TokenStorageService],
})
export class HeaderComponent implements OnInit {
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSidebarCollapsed: boolean = false;

  user!: User;

  readonly tokenStorage = inject(TokenStorageService);

  ngOnInit() {
    this.user = this.tokenStorage.getUserSession();
  }

  public onSidebarToggle(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.collapsed.emit(this.isSidebarCollapsed);
  }
}

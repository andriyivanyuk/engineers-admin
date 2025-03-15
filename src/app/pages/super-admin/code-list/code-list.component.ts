import { Component, inject, OnInit } from '@angular/core';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { CodeService } from '../services/code.service';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RegistrationCode } from '../models/registrationCode';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-code-list',
  templateUrl: './code-list.component.html',
  styleUrls: ['./code-list.component.scss'],
  imports: [HeadingComponent, MaterialModule],
  providers: [CodeService],
})
export class CodeListComponent implements OnInit {
  title: string = 'Список кодів';
  displayedColumns: string[] = ['code', 'isUsed', 'created', 'actions'];
  dataSource!: MatTableDataSource<RegistrationCode>;

  isLoaded: boolean = false;
  constructor() {}

  readonly loader = inject(NgxUiLoaderService);
  readonly snackBar = inject(MatSnackBar);

  readonly codeService = inject(CodeService);

  public removeCode(code: string) {
    this.loader.start();
    this.codeService.deleteCode(code).subscribe({
      next: (result) => {
        this.snackBar.open(result.message, 'Закрити', {
          duration: 3000,
        });
        this.getCodeList();
      },
      error: (error) => {
        this.loader.stop();
        console.error(error);
      },
    });
  }

  public getCodeList(): void {
    this.loader.start();
    this.codeService.listCodes().subscribe({
      next: (result) => {
        this.dataSource = new MatTableDataSource(result.codes);
        this.loader.stop();
        this.isLoaded = true;
      },
      error: (error) => {
        this.loader.stop();
        this.isLoaded = true;
        console.error(error);
      },
    });
  }

  public handleRefresh() {
    this.getCodeList();
  }

  ngOnInit() {
    this.getCodeList();
  }
}

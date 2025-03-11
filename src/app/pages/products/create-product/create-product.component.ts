import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HeadingComponent } from '../../../components/heading/heading.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  imports: [MaterialModule, HeadingComponent],
})
export class CreateProductComponent implements OnInit {
  title: string = 'Create Product';
  constructor() {}

  ngOnInit() {}
}

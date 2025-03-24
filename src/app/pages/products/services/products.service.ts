import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProductResponse } from '../models/createProductResponse';
import { ProductListResponse } from '../models/productListResponse';
import { ViewProduct } from '../models/viewProduct';
import { DetailsProductResponse } from '../models/updatedProductResponse';

@Injectable()
export class ProductService {
  private apiUrl = 'http://localhost:5500/api/admin';
  private r2PublicDomain =
    'https://pub-f2a1168bcc8267043d925c14d7a08960.r2.dev';
  private workerDomain = 'https://r2-proxy-worker.andriyivvanyuk.workers.dev';

  readonly http = inject(HttpClient);

  public getProducts(
    page: number,
    limit: number,
    search: string = ''
  ): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`, {
      params,
    });
  }

  public mapProducts(products: ViewProduct[]): ViewProduct[] {
    return products.map((item: ViewProduct) => {
      return {
        ...item,
        image_path: item.image_path?.replace(
          this.r2PublicDomain,
          this.workerDomain
        ),
      };
    });
  }

  public getProductById(productId: number): Observable<DetailsProductResponse> {
    return this.http.get<DetailsProductResponse>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  public addProduct(product: FormData): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      this.apiUrl + '/product/add',
      product
    );
  }

  public updateProduct(
    productId: number,
    product: FormData
  ): Observable<DetailsProductResponse> {
    return this.http.put<DetailsProductResponse>(
      `${this.apiUrl}/product/${productId}`,
      product
    );
  }

  public deleteProduct(productId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  public deleteImages(imageIds: number[] | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/productImages`, {
      body: { imageIds },
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CreateProductResponse } from '../models/createProductResponse';

@Injectable()
export class ProductService {
  private apiUrl = 'http://localhost:5500/api/admin';

  constructor(private http: HttpClient) {}

  public getProducts(
    page: number,
    limit: number,
    search: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrl}/products`, { params }).pipe(
      map((result) => ({
        total: result.total,
        page: result.page,
        limit: result.limit,
        products: result.products.map((product: any) => ({
          ...product,
          images: product.images?.map((image: any) => ({
            ...image,
            fullPath: `http://localhost:5500/${image.image_path}`,
          })),
        })),
      }))
    );
  }

  public mapProducts(products: any[]): any[] {
    return products.map((product) => {
      const primaryImage = product?.images?.find(
        (image: any) => image.is_primary === true
      );
      return {
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        status_name: product.status_name,
        fullPath: primaryImage ? primaryImage.fullPath : null,
      };
    });
  }

  public getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${productId}`);
  }

  public addProduct(product: FormData): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      this.apiUrl + '/product/add',
      product
    );
  }

  public updateProduct(productId: number, product: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/product/${productId}`, product);
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

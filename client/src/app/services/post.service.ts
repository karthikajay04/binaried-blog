import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = 'http://localhost:5000/api/posts';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPostById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData, {
      headers: this.getAuthHeaders(),
    });
  }

  updatePost(id: string, postData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, postData, {
      headers: this.getAuthHeaders(),
    });
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost, BlogPostPage } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8080/api/blog';

  constructor(private http: HttpClient) { }

  getPublishedPosts(page: number = 0, size: number = 10): Observable<BlogPostPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<BlogPostPage>(`${this.apiUrl}/public/posts`, { params });
  }

  getPublishedPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/public/posts/${id}`);
  }

  searchPosts(keyword: string, page: number = 0, size: number = 10): Observable<BlogPostPage> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<BlogPostPage>(`${this.apiUrl}/public/posts/search`, { params });
  }

  getAllPosts(page: number = 0, size: number = 10): Observable<BlogPostPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<BlogPostPage>(`${this.apiUrl}/posts`, { params });
  }

  createPost(post: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: BlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
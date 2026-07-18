import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <!-- Back Button -->
      <a routerLink="/" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="back-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Articles
      </a>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="state-container">
        <div class="spinner"></div>
        <p>Loading article details...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading() && error()" class="state-container error-state">
        <h3>Article not found</h3>
        <p>{{ error() }}</p>
        <a routerLink="/" class="btn-home">Go Home</a>
      </div>

      <!-- Post Content -->
      <article *ngIf="!isLoading() && post()" class="post-article">
        <!-- Post Header -->
        <header class="post-header">
          <!-- Title -->
          <h1 class="post-title">{{ post().title }}</h1>

          <!-- Meta Info -->
          <div class="post-meta">
            <div class="author-details">
              <div class="avatar">{{ getInitials(post().author?.name) }}</div>
              <div class="meta-text">
                <span class="author-name">{{ post().author?.name || 'Anonymous' }}</span>
                <span class="author-email" *ngIf="post().author?.email">{{ post().author?.email }}</span>
              </div>
            </div>
            <div class="post-date-container">
              <span class="meta-label">Published on</span>
              <span class="post-date">{{ formatDate(post().createdAt) }}</span>
            </div>
          </div>

          <!-- Owner Actions -->
          <div class="post-actions" *ngIf="isOwner()">
            <a [routerLink]="['/posts', post()._id, 'edit']" class="btn-action btn-edit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="action-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit Post
            </a>
            <button (click)="deletePost()" class="btn-action btn-delete">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="action-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete Post
            </button>
          </div>

          <!-- Tags -->
          <div class="post-tags" *ngIf="post().tags && post().tags.length > 0">
            <span *ngFor="let tag of post().tags" class="tag">#{{ tag }}</span>
          </div>
        </header>

        <!-- Divider -->
        <hr class="divider" />

        <!-- Body Content -->
        <div class="post-body">
          <p *ngFor="let paragraph of getParagraphs(post().content)">
            {{ paragraph }}
          </p>
        </div>
      </article>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: 5rem;
    }
    
    /* Back Button */
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 2.5rem;
      transition: color 0.2s ease;
      cursor: pointer;
    }
    .btn-back:hover {
      color: #f8fafc;
    }
    .back-icon {
      width: 18px;
      height: 18px;
    }

    /* Article Structure */
    .post-article {
      background: #111827;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }
    @media (max-width: 640px) {
      .post-article {
        padding: 1.5rem;
      }
    }
    
    .post-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: #f8fafc;
      line-height: 1.25;
      margin-bottom: 1.5rem;
      letter-spacing: -0.025em;
    }

    /* Meta Details */
    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .author-details {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      font-size: 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .meta-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .author-name {
      color: #f8fafc;
      font-weight: 600;
      font-size: 1rem;
    }
    .author-email {
      color: #64748b;
      font-size: 0.8rem;
    }
    .post-date-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.15rem;
    }
    @media (max-width: 640px) {
      .post-date-container {
        align-items: flex-start;
      }
    }
    .meta-label {
      color: #64748b;
      font-size: 0.775rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .post-date {
      color: #cbd5e1;
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* Owner Actions */
    .post-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .action-icon {
      width: 16px;
      height: 16px;
    }
    .btn-edit {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    .btn-edit:hover {
      background: rgba(59, 130, 246, 0.2);
      color: white;
    }
    .btn-delete {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: white;
    }

    /* Tags */
    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .tag {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.3rem 0.8rem;
      border-radius: 6px;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    /* Divider */
    .divider {
      border: none;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 2rem 0;
    }

    /* Body Text */
    .post-body {
      color: #cbd5e1;
      font-size: 1.1rem;
      line-height: 1.75;
      letter-spacing: -0.01em;
    }
    .post-body p {
      margin-bottom: 1.5rem;
    }

    /* States (Loading/Error) */
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(99, 102, 241, 0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .error-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #ef4444;
    }
    .error-state p {
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .btn-home {
      background: rgba(255, 255, 255, 0.08);
      color: white;
      text-decoration: none;
      padding: 0.6rem 1.4rem;
      border-radius: 8px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;
    }
    .btn-home:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private router = inject(Router);
  public authService = inject(AuthService);

  post = signal<any | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchPost(id);
      } else {
        this.error.set('No article ID specified.');
        this.isLoading.set(false);
      }
    });
  }

  fetchPost(id: string) {
    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.post.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.error.set(err.error?.error || 'Article details could not be retrieved.');
        this.isLoading.set(false);
      }
    });
  }

  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    const currentPost = this.post();
    return !!(currentUser && currentPost && currentPost.author?._id === currentUser.id);
  }

  deletePost() {
    const currentPost = this.post();
    if (currentPost && confirm('Are you sure you want to delete this article?')) {
      this.postService.deletePost(currentPost._id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert(err.error?.error || 'Failed to delete the article.');
        }
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getParagraphs(content: string): string[] {
    if (!content) return [];
    return content.split('\\n\\n').flatMap(c => c.split('\n\n')).filter(p => p.trim().length > 0);
  }
}

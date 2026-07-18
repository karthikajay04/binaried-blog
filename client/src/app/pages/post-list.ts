import { Component, inject, signal, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="feed-container">
      <header class="feed-header">
        <h1>Latest Articles</h1>
        <p>Explore stories, tutorials, and insights shared by authors.</p>
      </header>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="state-container">
        <div class="spinner"></div>
        <p>Loading posts...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading() && errorMessage()" class="state-container error-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="error-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <h3>Connection error</h3>
        <p>{{ errorMessage() }}</p>
        <button (click)="loadPosts()" class="btn-retry">Retry Connection</button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !errorMessage() && posts().length === 0" class="state-container empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <h3>No articles found</h3>
        <p>Be the first to share your thoughts by creating a new post!</p>
        <a routerLink="/new-post" class="btn-create-prompt">Create Post</a>
      </div>

      <!-- Posts Grid -->
      <div *ngIf="!isLoading() && !errorMessage() && posts().length > 0" class="posts-grid">
        <article *ngFor="let post of posts()" class="post-card" [routerLink]="['/posts', post._id]">
          <div class="card-content">
            <!-- Title -->
            <h2 class="post-title">{{ post.title }}</h2>
            
            <!-- Body Preview -->
            <p class="post-preview">{{ getPreviewText(post.content) }}</p>

            <!-- Tags -->
            <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
              <span *ngFor="let tag of post.tags" class="tag">#{{ tag }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <footer class="card-footer">
            <div class="author-info">
              <div class="avatar">{{ getInitials(post.author?.name) }}</div>
              <span class="author-name">{{ post.author?.name || 'Anonymous' }}</span>
            </div>
            <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          </footer>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .feed-header {
      margin-bottom: 3rem;
      text-align: left;
    }
    .feed-header h1 {
      font-size: 2.75rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.03em;
    }
    .feed-header p {
      color: #94a3b8;
      font-size: 1.1rem;
    }
    
    /* Grid Layout */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }
    @media (max-width: 768px) {
      .posts-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Card Styling */
    .post-card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .post-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 12px 30px rgba(99, 102, 241, 0.15);
    }
    .card-content {
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .post-title {
      font-size: 1.4rem;
      font-weight: 750;
      color: #f8fafc;
      margin-bottom: 0.75rem;
      line-height: 1.35;
      transition: color 0.2s ease;
    }
    .post-card:hover .post-title {
      color: #6366f1;
    }
    .post-preview {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: auto;
    }
    .tag {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      border: 1px solid rgba(99, 102, 241, 0.15);
    }

    /* Card Footer */
    .card-footer {
      background: rgba(15, 23, 42, 0.4);
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .author-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      font-size: 0.85rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
    .author-name {
      color: #cbd5e1;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .post-date {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* States (Loading / Empty / Error) */
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
    .empty-state h3, .error-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 1.5rem 0 0.5rem;
      color: #cbd5e1;
    }
    .error-state h3 {
      color: #f87171;
    }
    .empty-state p, .error-state p {
      color: #64748b;
      margin-bottom: 2rem;
      max-width: 400px;
      line-height: 1.5;
    }
    .empty-icon, .error-icon {
      width: 64px;
      height: 64px;
      color: #475569;
    }
    .error-icon {
      color: #f87171;
    }
    .btn-create-prompt, .btn-retry {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.75rem;
      border-radius: 8px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
      transition: all 0.2s ease;
    }
    .btn-create-prompt:hover, .btn-retry:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
    }
  `]
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);

  posts = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.errorMessage.set('Failed to retrieve blog articles. Please check your network connection or verify the server is running.');
        this.isLoading.set(false);
      }
    });
  }

  getPreviewText(content: string): string {
    if (!content) return '';
    return content.length > 120 ? content.substring(0, 120) + '...' : content;
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="form-card">
      <!-- Cancel/Back Button -->
      <a [routerLink]="isEditMode() ? ['/posts', postId] : ['/']" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="back-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Cancel
      </a>

      <h2>{{ pageTitle() }}</h2>
      <p class="subtitle">
        {{ isEditMode() ? 'Update your article details below.' : 'Share your coding insights with the community.' }}
      </p>

      <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="post-form">
        <!-- Error Alert -->
        <div *ngIf="errorMessage()" class="alert alert-error">
          {{ errorMessage() }}
        </div>

        <!-- Title Field -->
        <div class="form-group">
          <label for="title">Article Title</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            placeholder="e.g. Mastering Angular Signals"
            [class.invalid]="isFieldInvalid('title')"
          />
          <div *ngIf="isFieldInvalid('title')" class="error-msg">
            <span *ngIf="postForm.get('title')?.errors?.['required']">Title is required.</span>
            <span *ngIf="postForm.get('title')?.errors?.['maxlength']">Title cannot exceed 100 characters.</span>
          </div>
        </div>

        <!-- Tags Field -->
        <div class="form-group">
          <label for="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            formControlName="tags"
            placeholder="e.g. angular, signals, state-management"
          />
          <span class="field-hint">Separate tags with commas. e.g. "mongodb, express, node"</span>
        </div>

        <!-- Content Field -->
        <div class="form-group">
          <label for="content">Article Body Content</label>
          <textarea
            id="content"
            formControlName="content"
            rows="12"
            placeholder="Write your article content here..."
            [class.invalid]="isFieldInvalid('content')"
          ></textarea>
          <div *ngIf="isFieldInvalid('content')" class="error-msg">
            <span *ngIf="postForm.get('content')?.errors?.['required']">Content body is required.</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" [disabled]="postForm.invalid || isLoading()" class="btn-submit">
          {{ isLoading() ? 'Saving...' : (isEditMode() ? 'Update Post' : 'Publish Post') }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 720px;
      margin: 2rem auto;
      padding: 3rem;
      background: #111827;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }
    @media (max-width: 640px) {
      .form-card {
        padding: 1.5rem;
      }
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
      margin-bottom: 2rem;
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

    h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2.5rem;
      font-size: 0.95rem;
    }
    .post-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 600;
    }
    input, textarea {
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.8rem 1rem;
      color: #f8fafc;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    input.invalid, textarea.invalid {
      border-color: #ef4444;
    }
    input.invalid:focus, textarea.invalid:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
    .field-hint {
      color: #64748b;
      font-size: 0.8rem;
    }
    .error-msg {
      color: #f87171;
      font-size: 0.775rem;
      font-weight: 500;
    }
    .alert {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    .btn-submit {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      padding: 0.9rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      margin-top: 1rem;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  postForm: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  pageTitle = signal('Create New Post');
  postId: string | null = null;

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      tags: [''],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = id;
        this.isEditMode.set(true);
        this.pageTitle.set('Edit Post');
        this.fetchPost(id);
      }
    });
  }

  fetchPost(id: string) {
    this.isLoading.set(true);
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        // Enforce ownership: verify user is logged in and is the author
        const currentUser = this.authService.currentUser();
        if (!currentUser || post.author._id !== currentUser.id) {
          this.errorMessage.set('You are not authorized to edit this post.');
          this.postForm.disable();
          this.isLoading.set(false);
          return;
        }

        // Convert tags array to comma-separated string
        const tagsString = post.tags ? post.tags.join(', ') : '';

        this.postForm.patchValue({
          title: post.title,
          tags: tagsString,
          content: post.content
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(err.error?.error || 'Could not fetch post details for editing.');
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.postForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      // Parse tags from comma separated string
      const tagsString = this.postForm.value.tags;
      const parsedTags = tagsString
        ? tagsString.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [];

      const postData = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        tags: parsedTags
      };

      const request$ = this.isEditMode() && this.postId
        ? this.postService.updatePost(this.postId, postData)
        : this.postService.createPost(postData);

      request$.subscribe({
        next: (res) => {
          this.router.navigate(['/posts', res._id]);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.error || 'Failed to save post. Please try again.');
        }
      });
    }
  }
}

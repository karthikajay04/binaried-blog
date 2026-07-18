import { Component } from '@angular/core';

@Component({
  selector: 'app-new-post',
  standalone: true,
  template: `
    <div style="max-width: 600px; margin: 2rem auto; padding: 2.5rem; background: #111827; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
      <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Create New Post</h2>
      <p style="color: #94a3b8; line-height: 1.5;">Placeholder new post editor container.</p>
    </div>
  `
})
export class NewPostComponent {}

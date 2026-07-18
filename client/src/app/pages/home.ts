import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="padding: 3rem 1.5rem; text-align: center;">
      <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.03em;">Welcome to Binaried Blog</h1>
      <p style="color: #94a3b8; font-size: 1.25rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        A premium, developer-focused blogging platform where code meets narrative.
      </p>
    </div>
  `
})
export class HomeComponent {}

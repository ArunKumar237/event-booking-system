import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    // Keep bootstrap diagnostics for local debugging only.
    // Avoid leaking implementation details in production console output.
    if (isDevMode()) {
      console.error(err);
    }
  });

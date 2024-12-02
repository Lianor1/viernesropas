import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode = this.darkMode.asObservable();

  constructor() {
    // Recuperar el tema guardado
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.setDarkMode(savedTheme === 'true');
    }
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode.value);
  }
} 
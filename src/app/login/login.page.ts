import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  nombres: string = '';
  apellidos: string = '';
  isLogin: boolean = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async onSubmit() {
    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: this.isLogin ? 'Iniciando sesión...' : 'Registrando...'
      });
      await loading.present();

      if (this.isLogin) {
        const { data, error } = await this.supabase.login(this.email, this.password);
        if (error) throw error;

        if (!data.user) {
          throw new Error('No se encontró información del usuario');
        }

        console.log('Login exitoso:', {
          user: data.user,
          metadata: data.user.user_metadata
        });

        const role = data.user.user_metadata?.['role'] || 'usuario';
        this.router.navigate([role === 'admin' ? '/admin' : '/home']);
      } else {
        await this.supabase.registro(this.email, this.password, {
          nombres: this.nombres,
          apellidos: this.apellidos
        });
        
        this.presentToast('Registro exitoso. Por favor, inicia sesión.');
        this.isLogin = true;
      }
    } catch (error: any) {
      let mensaje = 'Error en la autenticación';
      
      if (error.message === 'Invalid login credentials') {
        mensaje = 'Credenciales inválidas';
      } else if (error.message === 'Email not confirmed') {
        mensaje = 'Por favor, confirma tu correo electrónico';
      }
      
      this.presentToast(mensaje);
      console.error('Error completo:', error);
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
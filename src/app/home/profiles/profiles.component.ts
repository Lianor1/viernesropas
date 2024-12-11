import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

interface Profile {
  id: string;
  nombre_completo: string;
  email: string;
  created_at: string;
  image: string | null;
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
  profile: Profile = {
    id: '',
    nombre_completo: '',
    email: '',
    created_at: new Date().toISOString(),
    image: null
  };

  constructor(
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.supabase.getCurrentUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await this.supabase.getClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        this.profile = data;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.showToast('Error al cargar el perfil');
    } finally {
      loading.dismiss();
    }
  }

  async selectImage() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const loading = await this.loadingCtrl.create({
            message: 'Subiendo imagen...'
          });
          await loading.present();

          try {
            const user = await this.supabase.getCurrentUser();
            if (!user) throw new Error('No user found');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { data, error } = await this.supabase.getClient()
              .storage
              .from('avatars')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (error) throw error;

            const { data: { publicUrl } } = this.supabase.getClient()
              .storage
              .from('avatars')
              .getPublicUrl(filePath);

            await this.updateProfileImage(publicUrl);
            this.profile.image = publicUrl;

            this.showToast('Imagen actualizada con éxito');
          } catch (error) {
            console.error('Error:', error);
            this.showToast('Error al subir la imagen');
          } finally {
            loading.dismiss();
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('Error:', error);
      this.showToast('Error al seleccionar la imagen');
    }
  }

  async updateProfile() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.supabase.getCurrentUser();
      if (!user) throw new Error('No user found');

      if (this.profile.image && this.profile.image.startsWith('data:image')) {
        const response = await fetch(this.profile.image);
        const blob = await response.blob();

        const fileExt = 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await this.supabase.getClient()
          .storage
          .from('avatars')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = this.supabase.getClient()
          .storage
          .from('avatars')
          .getPublicUrl(filePath);

        this.profile.image = publicUrl;
      }

      const { error: updateError } = await this.supabase.getClient()
        .from('profiles')
        .update({
          nombre_completo: this.profile.nombre_completo,
          image: this.profile.image
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      this.showToast('Perfil actualizado con éxito');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showToast('Error al actualizar el perfil');
    } finally {
      loading.dismiss();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    await toast.present();
  }

  private async updateProfileImage(imageUrl: string) {
    try {
      const user = await this.supabase.getCurrentUser();
      if (!user) throw new Error('No user found');

      const { error } = await this.supabase.getClient()
        .from('profiles')
        .update({ image: imageUrl })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar imagen',
      buttons: [
        {
          text: 'Seleccionar de la galería',
          icon: 'image',
          handler: () => {
            this.selectImage();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) return 'assets/default-avatar.jpg';
    
    if (imagePath.startsWith('data:image') || imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data: { publicUrl } } = this.supabase.getClient()
      .storage
      .from('avatars')
      .getPublicUrl(imagePath);
    
    return publicUrl;
  }
}

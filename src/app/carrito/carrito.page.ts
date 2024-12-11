import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  showPaymentModal: boolean = false;
  selectedPayment: string = '';

  constructor(
    private cartService: CartService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.precio * (item.quantity || 1));
    }, 0);
  }

  decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
      this.updateTotal();
    }
  }

  increaseQuantity(item: any) {
    if (!item.quantity) {
      item.quantity = 1;
    }
    item.quantity++;
    this.updateTotal();
  }

  removeFromCart(item: any) {
    this.cartService.removeItem(item);
    this.cartItems = this.cartService.getItems();
    this.updateTotal();
  }

  showPaymentOptions() {
    if (this.cartItems.length === 0) {
      this.presentToast('Agrega productos al carrito para continuar');
      return;
    }
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedPayment = '';
  }

  async processPayment() {
    try {
      if (!this.selectedPayment) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Por favor, seleccione un método de pago',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      const cartData = {
        cartItems: this.cartItems.map(item => ({
          nombre: item.nombre,
          color: item.color,
          tallas: item.tallas,
          precio: item.precio,
          quantity: item.quantity || 1
        })),
        total: this.total
      };

      console.log('Guardando datos para el vaucher:', cartData);
      this.cartService.setVaucherData(cartData);

      const alert = await this.alertController.create({
        header: 'Pago Exitoso',
        message: `Su pago con ${this.selectedPayment.toUpperCase()} se ha realizado correctamente`,
        buttons: [
          {
            text: 'Ver Voucher',
            handler: () => {
              window.location.href = '/vaucher';
            }
          }
        ],
        backdropDismiss: false
      });

      await alert.present();

    } catch (error) {
      console.error('Error en processPayment:', error);
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al procesar el pago. Por favor, intente nuevamente.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  // Agregar un método para validar el estado del carrito
  private validateCart(): boolean {
    return this.cartItems.length > 0 && this.total > 0;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }
}

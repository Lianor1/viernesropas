import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.precio) * (item.quantity || 1)), 0);
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

      this.cartService.setVaucherData(cartData);

      const alert = await this.alertController.create({
        header: 'Pago Exitoso',
        message: `Su pago con ${this.selectedPayment.toUpperCase()} se ha realizado correctamente`,
        buttons: [
          {
            text: 'Ver Voucher',
            handler: () => {
              this.cartService.clearCart();
              this.cartItems = [];
              this.updateTotal();
              this.closePaymentModal();
              this.navCtrl.navigateForward('/vaucher')
                .then(() => {
                  console.log('Navegación exitosa');
                })
                .catch(err => {
                  console.error('Error en navegación:', err);
                });
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
}

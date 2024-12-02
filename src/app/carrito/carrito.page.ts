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
    if (this.selectedPayment === 'vaucher') {
      this.closePaymentModal();
      this.router.navigate(['/vaucher'], {
        state: { 
          cartItems: this.cartItems.map(item => ({
            nombre: item.nombre,
            color: item.color,
            tallas: item.tallas,
            precio: item.precio,
            quantity: item.quantity || 1
          })),
          total: this.total
        }
      });
    } else if (this.selectedPayment) {
      const alert = await this.alertController.create({
        header: 'Pago Exitoso',
        message: `
          <div style="display: flex; flex-direction: column; align-items: center; padding: 1rem;">
            <div style="background-color: #ff0000; border-radius: 50%; width: 64px; height: 64px; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem;">
              <div style="color: #00ff00; font-size: 40px;">✓</div>
            </div>
            <p style="margin: 0; color: #2dd36f; font-weight: bold;">El pago con ${this.selectedPayment.toUpperCase()} se realizó correctamente</p>
          </div>
        `,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/vaucher'], {
              state: { 
                cartItems: this.cartItems.map(item => ({
                  nombre: item.nombre,
                  color: item.color,
                  tallas: item.tallas,
                  precio: item.precio,
                  quantity: item.quantity || 1
                })),
                total: this.total
              }
            });
            
            this.cartService.clearCart();
            this.cartItems = [];
            this.updateTotal();
            this.closePaymentModal();
          }
        }]
      });

      await alert.present();
    }
  }
}

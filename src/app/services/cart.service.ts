import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject(0);
  private items: any[] = [];
  private vaucherData: any = null;

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  addItem(producto: any) {
    const existingItem = this.items.find(item => 
      item.id === producto.id && 
      item.tallas === producto.tallas && 
      item.color === producto.color
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      producto.quantity = 1;
      this.items.push(producto);
    }

    this.cartItemCount.next(this.getTotalItems());
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  getItems() {
    return this.items;
  }

  removeItem(producto: any) {
    const index = this.items.findIndex(item => 
      item.id === producto.id && 
      item.tallas === producto.tallas && 
      item.color === producto.color
    );
    
    if (index > -1) {
      this.items.splice(index, 1);
      this.cartItemCount.next(this.getTotalItems());
    }
  }

  clearCart() {
    this.items = [];
    this.cartItemCount.next(0);
  }

  setVaucherData(data: any) {
    console.log('Guardando datos del vaucher:', data);
    this.vaucherData = data;
    localStorage.setItem('vaucherData', JSON.stringify(data));
  }

  getVaucherData() {
    if (!this.vaucherData) {
      const savedData = localStorage.getItem('vaucherData');
      if (savedData) {
        this.vaucherData = JSON.parse(savedData);
      }
    }
    console.log('Recuperando datos del vaucher:', this.vaucherData);
    return this.vaucherData;
  }

  clearVaucherData() {
    this.vaucherData = null;
    localStorage.removeItem('vaucherData');
  }
} 
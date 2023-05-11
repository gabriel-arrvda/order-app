import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CartPage {

  cart$!: Observable<any[]>

  sub = new Subscription()

  constructor(
    private router: Router,
    private fbService: FirebaseService,
    private toastController: ToastController
  ) { }

  ionViewWillEnter() {
    this.cart$ = this.fbService.cart$
  }

  ionViewWillLeave() {
    this.sub.unsubscribe()
  }

  back() {
    this.router.navigate(['/tabs/tab1'])
  }

  remove(id: string) {
    this.fbService.removeFromCart(id)
  }

  total() {
    let total = 0

    if (this.cart$) {
      this.sub = this.cart$.subscribe(cart => {
        cart.forEach(obj => {
          total += obj.qtd * obj.produto.preco
        })
      })
    }
    return total
  }

  finish() {
    this.fbService.savePedido(this.total()).then(async () => {
      this.fbService.clearCart()
      this.router.navigate(['/tabs/tab1'])

      const toast = await this.toastController.create({
        message: "Pedido realizado com sucesso!",
        duration: 2000
      });
      toast.present();
    })
  }
}

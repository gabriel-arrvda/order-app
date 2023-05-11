import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FilterPipe } from '../pipes/filter.pipe';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FilterPipe],
})
export class Tab1Page {

  cardapio$ = this.fbService.getCardapio()

  listFilter = ''

  constructor(
    private fbService: FirebaseService,
    private alertController: AlertController,
    private router: Router
  ) { }

  trackById(i: number, cardapio: any) {
    return cardapio.id;
  }

  cart() {
    this.router.navigate(['/tabs/tab1/cart'])
  }

  async addToCart(produto: any) {
    const alert = await this.alertController.create({
      header: 'Adicionar ao carrinho',
      inputs: [
        {
          name: 'qtd',
          type: 'number',
          placeholder: 'Quantidade',
          min: 1,
          max: 20,
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Adicionar',
          cssClass: 'secondary',
          handler: (alertData) => {
            this.fbService.addToCart({ produto, qtd: alertData.qtd })
            this.router.navigate(['/tabs/tab1/cart'])
          }
        }
      ]
    });

    await alert.present();
  }
}

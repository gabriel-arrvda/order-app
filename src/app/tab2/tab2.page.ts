import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FilterPipe } from '../pipes/filter.pipe';
import { UnixTimePipe } from '../pipes/unix-time.pipe';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, FilterPipe, UnixTimePipe]
})
export class Tab2Page {

  pedidos$!: Observable<any[]>

  listFilter = ''

  constructor(
    private fbService: FirebaseService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.pedidos$ = this.fbService.getPedidos()
  }

  trackById(i: number, pedido: any) {
    return pedido.id;
  }

  openCamera(pedido: any) {
    if (pedido.dataCompleted) return

    this.router.navigate(['/tabs/tab2/camera'], { queryParams: { id: pedido.hash } })
  }
}

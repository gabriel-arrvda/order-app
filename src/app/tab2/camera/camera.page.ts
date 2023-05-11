import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CameraPage {

  scanner = false
  success = false

  constructor(
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private fbService: FirebaseService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.startScanner()
  }

  back() {
    this.stopScanner()
    this.router.navigate(['/tabs/tab2'])
  }

  ionViewWillLeave() {
    this.stopScanner()
  }

  async startScanner() {
    this.success = false
    const allowed = await this.checkPermission()
    if (allowed) {
      BarcodeScanner.hideBackground();
      this.scanner = true;

      console.log("🚀 ~ file: camera-modal.component.ts ~ line 33 ~ CameraModalComponent ~ startScanner ~ this.scanner = true")

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.stopScanner()

        try {
          if (result.content === this.activatedRoute.snapshot.paramMap.get('id')) {
            await this.fbService.updatePedido(this.activatedRoute.snapshot.paramMap.get('id'))
            this.success = true
            setTimeout(() => {
              this.back()
            }, 3000)
          }

          this.presentError()
        } catch (e) {
          this.presentError()
        }
      }
    }
  }

  async presentError() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ERRO',
      message: 'Não foi possível ler o QrCode',
      buttons: ['OK']
    });

    await alert.present();
  }

  async checkPermission() {
    return new Promise(async (resolve, _) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true)
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'Erro nas Permissões',
          message: 'Por favor habilite as permissões de uso de câmera nas Preferências do seu celular',
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Abrir Preferências',
            handler: () => {
              resolve(false);
              BarcodeScanner.openAppSettings();
            }
          }]
        })
      } else {
        resolve(false)
      }
    })
  }

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanner = false;
  }

}

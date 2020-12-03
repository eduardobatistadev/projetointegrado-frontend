import { Component } from '@angular/core';
import { IonicPage, LoadingController, MenuController, NavController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(public navCtrl: NavController, 
              public menu:MenuController, 
              public auth: AuthService,
              public loading: LoadingController) {
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave(){
    this.menu.swipeEnable(true);
  }
  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response =>{
      this.auth.successfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});
  
  }
  login(){
    
    this.auth.authenticate(this.creds)
      .subscribe(response =>{
        this.auth.successfulLogin(response.headers.get('Authorization'));
        let loader =this.presentLoading();
        this.navCtrl.setRoot('CategoriasPage');
        loader.dismiss();
      },
      error => {
     
      });
  }

  signup(){
    let loader =this.presentLoading();
    this.navCtrl.push('SignupPage');
    loader.dismiss();
  }

  presentLoading(){
    let loader = this.loading.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { Camera, CameraOptions  } from '@ionic-native/camera';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public camera: Camera, 
              public navParams: NavParams, 
              public storage: StorageService,
              public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    this.loadData();
  }
  loadData(){
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
      .subscribe(response =>{
        this.cliente = response as ClienteDTO;
        this.getImageIfExists();

      }, error =>{
        if(error.status == 403){
            this.navCtrl.setRoot('HomePage');
        }
      });
    }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response =>{
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`; 
      },
      error =>{});
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then ((imagemData) =>{
      this.picture = 'data:image/png;base64,' + imagemData;
      this.cameraOn = false;
    }, (err) =>{
      this.cameraOn = false;
    });
  }


  sendPicture(){
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response =>{
        this.picture=null;
        this.loadData();
      },
      error =>{});
  }

  cancel(){
    this.picture = null;
  }

}

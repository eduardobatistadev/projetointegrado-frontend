import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';


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
  profileImage;

  constructor(public navCtrl: NavController,
              public camera: Camera, 
              public navParams: NavParams, 
              public storage: StorageService,
              public clienteService: ClienteService,
              public sanitizer: DomSanitizer,
              public loading: LoadingController) {

                this.profileImage = 'assets/imgs/avatar-blank.png';
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
        this.blobToDataUrl(response).then(dataUrl =>{
          let str: string = dataUrl as string;
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
        });
      },
      error =>{
        this.profileImage = 'assets/imgs/avatar-blank.png';
      });
  }

  blobToDataUrl(blob){
    return new Promise((fulfill, reject) =>{
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
        correctOrientation: true,
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG
       // encodingType: this.camera.EncodingType.PNG,
       // mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then ((imagemData) =>{
      this.picture = 'data:image/png;base64,' + imagemData;
      this.cameraOn = false;
    }, (err) =>{
      this.cameraOn = false;
    });
  }



  getGalleryPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
        correctOrientation: true,
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG
       // encodingType: this.camera.EncodingType.PNG,
       // mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then ((imagemData) =>{
      this.picture = 'data:image/png;base64,' + imagemData;
      this.cameraOn = false;
    }, (err) =>{
      this.cameraOn = false;
    });
  }


  sendPicture(){
    let loader =this.presentLoading();
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response =>{
        this.picture=null;
        this.getImageIfExists();
        loader.dismiss();
      },
      error =>{});
  }

  cancel(){
    this.picture = null;
  }
  presentLoading(){
    let loader = this.loading.create({
      content: "Carregando imagem..."
    });
    loader.present();
    return loader;
  }

}

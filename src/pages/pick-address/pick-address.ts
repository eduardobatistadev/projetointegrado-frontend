import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';


@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = [
      {
        id:"1",
        logradouro: "Rua Quinze de novembro",
        numero: "345",
        complemento: "Apt 50",
        bairro: "Jd santa monica",
        cep: "07138-984",
        cidade: {
          id: "1",
          nome: "Uberlândia",
          estado: {
            id: "1",
            nome: "Minas Gerais"
          }
        }
      },

      {
        id:"2",
        logradouro: "Rua Toledo",
        numero: "385",
        complemento: null,
        bairro: "Centro",
        cep: "07138-789",
        cidade: {
          id: "3",
          nome: "São Paulo",
          estado: {
            id: "2",
            nome: "São Paulo"
          }
        }
      }
    ];
  }

}

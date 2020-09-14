import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

interface FacilityData {
  Name: string;
  Address: string;
  Needs: string;
  Wallet: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['./home.scss']
})
export class HomePage {

  facilityList = [];
  facilityData: FacilityData;
  facilityForm: FormGroup;

  constructor(public navCtrl: NavController, private menu: MenuController, private firebaseService: FirebaseService,
    public fb: FormBuilder) {
      this.facilityData = {} as FacilityData;
  }

  OpenFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  ngOnInit() {

    this.facilityForm = this.fb.group({
      Name: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Needs: ['', [Validators.required]],
      Wallet: ['', [Validators.required]]
    })

    this.firebaseService.read_campaign().subscribe(data => {

      this.facilityList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Address: e.payload.doc.data()['Address'],
          Needs: e.payload.doc.data()['Needs'],
          Wallet: e.payload.doc.data()['Wallet']
        };
      })

    });
  }

  ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");

    // appManager.sendIntent("action", {mydata: datavalue}, null, (response: any) => {
    //   // Intent was handled by another app and response data is returned
    // }, (err) => {
    //     // Something wrong happened
    // })
    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Home");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }
}

import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { loadavg } from 'os';

import { Clipboard } from '@ionic-native/clipboard/ngx';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

interface ImagesData {
  filepath: string;
}

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

  task: AngularFireUploadTask;
  UploadedFileURL: Observable<string>;
  facilityList = [];
  facilityData: FacilityData;
  facilityForm: FormGroup;

  // CopyTextAreaText:string = this.facilityData.Wallet;
  PasteTextAreaText:string = "Paste here!";

  images: Observable<ImagesData[]>;

  private imageCollection: AngularFirestoreCollection<ImagesData>;
  constructor(public navCtrl: NavController, 
    private menu: MenuController, 
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage, private database: AngularFirestore,
    public fb: FormBuilder,
    private clipboard: Clipboard) {
      this.facilityData = {} as FacilityData;
      this.imageCollection = database.collection<ImagesData>('facilityImages');
      this.images = this.imageCollection.valueChanges();
  }

  copyText(){
    this.clipboard.copy(this.facilityData.Wallet);
  }

  pasteText(){
    this.clipboard.paste().then(
      (resolve: string) => {
         this.PasteTextAreaText = resolve;
         console.log(resolve);
       },
       (reject: string) => {
         console.error('Error: ' + reject);
       }
     );
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

  uploadFile(event: FileList) {

    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }


    // The storage path
    const path = `facilityStorage/${new Date().getTime()}_${file.name}`;


    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    // this.task = this.storage.upload(path, file);

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
      });  
  }

  load(){
    console.log(this.imageCollection.get);
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

    appManager.sendIntent(
      "pay",
      {
        receiver: 'ESe59nqkGkUVxX4jxNRM9tUQjXVQgyju99',
        amount: '0.1',
        memo: null,
      },
     {},
      (res) => { console.log(res); },
      (err) => { console.log(err); }
    );
    
    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Home");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }
}

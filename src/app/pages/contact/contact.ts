import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

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
  selector: 'page-contact',
  templateUrl: 'contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactPage {

  task: AngularFireUploadTask;
  UploadedFileURL: Observable<string>;
  facilityList = [];
  facilityData: FacilityData;
  facilityForm: FormGroup;

  //Uploaded Image List
  images: Observable<ImagesData[]>;

  private imageCollection: AngularFirestoreCollection<ImagesData>;
  constructor(
    public navCtrl: NavController, 
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage, private database: AngularFirestore,
    public fb: FormBuilder) {
      this.facilityData = {} as FacilityData;
      this.imageCollection = database.collection<ImagesData>('facilityImages');
      this.images = this.imageCollection.valueChanges();
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
    this.task = this.storage.upload(path, file);

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            filepath: resp
          });
        }, error => {
          console.error(error);
        })
      });
  }

  addImagetoDB(image: ImagesData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
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
          Address: e.payload.doc.data()['Age'],
          Needs: e.payload.doc.data()['Address'],
          Wallet: e.payload.doc.data()['Wallet']
        };
      })

    });
  }

  CreateRecord() {
    this.firebaseService.create_campaign(this.facilityForm.value)
      .then(resp => {
        //Reset form
        this.facilityForm.reset();
      })
      .catch(error => {
        console.log(error);
      });
  }

  ionViewDidEnter() {
    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Contact");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'Facility';

  constructor( private firestore: AngularFirestore ) { }

  create_campaign(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_campaign() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }
}

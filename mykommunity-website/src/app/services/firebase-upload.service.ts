import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root',
})
export class FirebaseUploadService {
location = 'Community/';
constructor(private angularFireStorage: AngularFireStorage) {}

/* Image name generator time */
imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
}


}
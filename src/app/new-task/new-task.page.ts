import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as firebase from 'firebase/app';
 


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {

  cloudFiles = [];

  constructor(private iab: InAppBrowser) { }
  ngOnInit() {
    this.loadFiles();
  }
 
  loadFiles() {
    this.cloudFiles = [];
 
    const storageRef = firebase.storage().ref('files');
    storageRef.listAll().then(result => {
      result.items.forEach(async ref => {
        this.cloudFiles.push({
          name: ref.name,
          full: ref.fullPath,
          url: await ref.getDownloadURL(),
          ref: ref
        });
      });
    });
  }
 
  openExternal(url) {
    this.iab.create(url);
  }
 
  deleteFile(ref: firebase.storage.Reference) {
    ref.delete().then(() => {
      this.loadFiles();
    });
  }

}

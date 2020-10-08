import { Component, OnInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { MediaCapture,MediaFile,CaptureError} from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
//import { Camera, CameraOptions } from '@ionic-native/camera';
 
 
const MEDIA_FOLDER_NAME = 'my_media';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  files = [];
  uploadProgress = 0;
 
  constructor(
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private toastCtrl: ToastController,
    private storage: AngularFireStorage,
   // private camera: Camera
    
  ) {}
 
  ngOnInit() {
    this.plt.ready().then(() => {
     let path = this.file.dataDirectory;
    this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
       () => {
          this.loadFiles();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    //   const options = {
    //     replace: true
    //   };
    //   const path = this.file.documentsDirectory;
    //   //const directory = 'Attendance Log';
    //   this.file
    //      .checkDir(path, MEDIA_FOLDER_NAME)
    //         .then(res => {
    //      this.file
    //         .writeFile(path, MEDIA_FOLDER_NAME,"",options)
    //            .then(res => {
    //      this.file.listDir(this.file.dataDirectory,MEDIA_FOLDER_NAME)
    //         .then(res => this.files=res)
    //         .catch(error => console.log("error"));
    //   })
    //   .catch(error => console.log("error"));
    // });
  }
    )}
 
  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );
  }
  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      buttons: [
        {
          text: 'Capture Image',
          handler: () => {
            this.captureImage();
          }
        },
        {
          text: 'Select Image',
          handler: () => {
            this.pickImages();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
 
  pickImages() {
    this.imagePicker.getPictures({}).then(
      results => {
        for (var i = 0; i < results.length; i++) {
          this.copyFileToLocalDir(results[i]);
        }
      }
    );
 
    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }
 
  captureImage() {
    this.mediaCapture.captureImage().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
 
 
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
 
    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;
 
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
 
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
 
  openFile(f: FileEntry) {
     this.photoViewer.show(f.nativeURL, 'MY awesome image');
  }
 
  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }

  async uploadFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    const type = this.getMimeType(f.name.split('.').pop());
    const buffer = await this.file.readAsArrayBuffer(path, f.name);
    const fileBlob = new Blob([buffer], type);
 
    const randomId = Math.random()
      .toString(36)
      .substring(2, 8);
 
    const uploadTask = this.storage.upload(
      `files/${new Date().getTime()}_${randomId}`,
      fileBlob
    );
 
    uploadTask.percentageChanges().subscribe(change => {
      this.uploadProgress = change;
    });
 
    uploadTask.then(async res => {
      const toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'File upload finished!'
      });
      toast.present();
    });
  }
 
  getMimeType(fileExt) {
    if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'png') return { type: 'image/png' };
  }
  // takePlayer(sourceType) {

  //   var options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     sourceType: sourceType,
  //     //saveToPhotoAlbum: false,
  //     correctOrientation: true,
  //     allowEdit: true
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.imageurl = imageData;
  //     let a = ' data:image/jpeg;base64,' + imageData;
  //     this.imagepath = "";
  //     this.imagepath = a;
  //     this.generateFromImage(this.imagepath, 200, 200, 0.5, data => {
  //       this.smallImg = data;
  //       this.smallSize = this.getImageSize(this.smallImg);
  //       this.image = this.smallImg;

  //     });

  //   });
  // }

  // generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
  //   var canvas: any = document.createElement("canvas");
  //   var image = new Image();

  //   image.onload = () => {
  //     var width = image.width;
  //     var height = image.height;

  //     if (width > height) {
  //       if (width > MAX_WIDTH) {
  //         height *= MAX_WIDTH / width;
  //         width = MAX_WIDTH;
  //       }
  //     } else {
  //       if (height > MAX_HEIGHT) {
  //         width *= MAX_HEIGHT / height;
  //         height = MAX_HEIGHT;
  //       }
  //     }
  //     canvas.width = width;
  //     canvas.height = height;
  //     var ctx = canvas.getContext("2d");

  //     ctx.drawImage(image, 0, 0, width, height);

  //     // IMPORTANT: 'jpeg' NOT 'jpg'
  //     var dataUrl = canvas.toDataURL('image/jpeg', quality);

  //     callback(dataUrl)
  //   }
  //   image.src = img;
  // }

}
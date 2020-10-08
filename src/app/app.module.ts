import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { from } from 'rxjs';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';


import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { File } from '@ionic-native/File/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
     IonicModule.forRoot(),
     AppRoutingModule,
     FormsModule,
     ReactiveFormsModule,
     AngularFireAuthModule,
     AngularFireModule.initializeApp(environment.firebase),
     AngularFirestoreModule,
     AngularFireStorageModule,  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    WebView,
    { provide: SETTINGS, useValue: {} },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MediaCapture,
    File,
    Media,
    StreamingMedia,
    PhotoViewer,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

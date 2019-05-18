import { Component, OnInit } from '@angular/core';
import { Plugins, AppState } from '@capacitor/core';

const { App } = Plugins;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor() {

    this.appInfo();

   }

  ngOnInit() {

  }

  async appInfo(){


    var ret = await App.getLaunchUrl();
    if(ret && ret.url) {
      console.log('App opened with URL: ' + ret.url);
      alert(ret.url);
    }
    console.log('Launch url: ', ret);
    
      }
  
  
}

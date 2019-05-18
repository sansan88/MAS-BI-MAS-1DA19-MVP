import {
  ApiService
} from './../api.service';
import {
  Component,
  OnInit
} from '@angular/core';


import {
  configuration
} from './../openid-configuration';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  Plugins
} from '@capacitor/core';
import {  ToastController } from '@ionic/angular';
const {
  Browser,
  Storage
} = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userProfile: any;
  constructor(
    private api: ApiService,
    private router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
  ) {

    /*
      Wird mit Storage object gemacht
    this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.userProfile = this.router.getCurrentNavigation().extras.state.userProfile;
        }
      });*/

  }
  ionViewWillEnter() {
    Storage.get({
      key: 'eIDUser'
    }).then(data => {
      this.userProfile = JSON.parse(data.value);
    },error=>{
      this.userProfile = null;
      console.error(error);
    });
  }

  ngOnInit() {}

  doLogin() {
    Browser.open({
      url: configuration.authorization_url_prod,
      presentationStyle: "popover",
      toolbarColor: "#FFDC00",
      windowName: "eId+"
    }).then(() => {
      console.log("browser open..");
    });


  }
  logout(){

    Storage.remove({
      key: 'eIDUser'
    }).then(() => {
      this.userProfile = null;

      this.router.navigateByUrl('/').then((success) => {
        this. presentToast();
      },(error)=>{

      });


    });

  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Logout erfolgreich',
      color: 'primary',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }
  


}


/*Browser.addListener("browserFinished",(info)=>{
  console.log("browserFinished")
})

Browser.addListener("browserPageLoaded",(info)=>{
  console.log("browserPageLoaded")
});*/

/*this.api.getLoginURL().subscribe((data) => {
  const url = data["url"];
  console.log(url);
});*/
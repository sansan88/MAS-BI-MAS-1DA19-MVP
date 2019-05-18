import {
  configuration
} from './../openid-configuration';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';
import { ApiService } from '../api.service';
import {
  Plugins
} from '@capacitor/core';
const {
  Storage
} = Plugins;

@Component({
  selector: 'app-return',
  templateUrl: './return.page.html',
  styleUrls: ['./return.page.scss'],
})
export class ReturnPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private http: HttpClient
  ) {

    this.route.queryParams.subscribe(params => {
      /* 
      console.log("code: " + params.code); //code: a223d4d12ba343b58ee5ed09ac200864
      console.log("state: " + params.state); //state:
      console.log("session_state: " + params.session_state); //session_state: 7998556414235d511ab7d1a10d12d6ba3c791abcc47576ee0b5069ee87767030.cf16b81eff8e93b9016ecd66343361b2
      console.log("url: " + params.url); //url: /app/return?code=a223d4d12ba343b58ee5ed09ac200864&state=&session_state=7998556414235d511ab7d1a10d12d6ba3c791abcc47576ee0b5069ee87767030.cf16b81eff8e93b9016ecd66343361b2
      */
      if (params && params.code) {

        const body = new HttpParams()
          .set('code', params.code)
          .set('grant_type', "authorization_code")
          .set('redirect_uri', configuration.redirect_uri_mobile_prod);

        this.http.post(configuration.token_endpoint,
          body.toString(), {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Authorization', 'Basic ' + btoa(configuration.client_id + ":" + configuration.client_secret))
          }
        ).subscribe(body => {
          //console.log(body["access_token"]);

          this.http.get(configuration.userinfo_endpoint, {
            headers: new HttpHeaders()
              .set('Authorization', "Bearer " + body["access_token"])
          }).subscribe(userProfile => {
            //console.log(userProfile);
            //this.api.setEIDUser(userProfile);

            Storage.set({
              key: 'eIDUser',
              value: JSON.stringify(userProfile)
            }).then(()=>{
              /*let navigationExtras: NavigationExtras = {
                state: {
                  userProfile: userProfile
                }
              };
              his.router.navigateByUrl('/app/profile',navigationExtras).then(success => {
              */
              this.router.navigateByUrl('/app/profile').then(success => {
  
              }, error => {
  
              });
            });



          }, error => {});
        }, error => {});
      }
    });

  }

  ngOnInit() {}




}
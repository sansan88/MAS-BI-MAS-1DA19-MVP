import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  map
} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) {}
  /* https://ionicacademy.com/ionic-4-app-api-calls/ */

  /*public getLoginURL(){
    return this.http.get('http://localhost:8200/api/login');
  }*/

/*
  public setEIDUser(user) {
    this.user = user;
  }
  public getEIDUser() {
    return this.user;
  }
*/

  public getInitiativen() {
    //    return this.http.get('http://localhost:8200/api/initiativen');
    return this.http.get('https://us-central1-sh-collect.cloudfunctions.net/initiativen');
  }

  public getDocuments(user) {
    return this.http.post('https://us-central1-sh-collect.cloudfunctions.net/getDocuments', {
      user: user
    }, {
      responseType: "text",
      headers: {
        "Accept": "application/json"
      }
    });

  }

  public getSignedUrl(document) {
    return this.http.post('https://us-central1-sh-collect.cloudfunctions.net/getSignedUrl', {
      document: document
    }, {
      responseType: "text",
      headers: {
        "Accept": "application/json"
      }
    });
  }

  public deletePDF(document) {
    return this.http.post('https://us-central1-sh-collect.cloudfunctions.net/deletePDF', {
      document: document
    }, {
      responseType: "text",
      headers: {
        "Accept": "application/json"
      }
    });

  }

  public supportInitiative(initiative, user) {

    return this.http.post('https://us-central1-sh-collect.cloudfunctions.net/generatepdf', {
      initiative: initiative,
      user: user
    }, {
      responseType: "text",
      headers: {
        "Accept": "application/json"
      }
    });

  }
}
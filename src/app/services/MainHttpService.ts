import { Injectable }                                   from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers }           from '@angular/http';
import { Observable }                                   from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { UserService }                                  from '../services/UserService';

@Injectable()
export class MainHttpService
{
    constructor(private http: Http, private userService: UserService, private baseUrl:string){}
    get (url:string, params?: [{ name: string, value: any}]): Observable<Response>
    {
        let request:RequestOptionsArgs = {};
        if (params)
        {
            for (let item of params)
            {
                request.search+=  (request.search != "" ? "&" : "") + item.name + "=" + item.value;        
            }
        }

        request.headers = new Headers({ 'Content-Type': 'application/json' , 'x-username' : this.userService.getUserName(), 'x-token' : this.userService.getToken()});

        return this.http.get(this.baseUrl + url, request);
    }

    post (url:string, params: any): Observable<Response>
    {
        let request:RequestOptionsArgs = {};
        request.headers = new Headers({ 'Content-Type': 'application/json' , 'x-username' : this.userService.getUserName(), 'x-token' : this.userService.getToken()});

        return this.http.post(this.baseUrl + url, params, request);
    }

    extractFromJsonData(res: Response, factory: (object: {}) => any)
    {
        let body:[{}] = res.json();
        console.log(body);
        let objects:any[] = [];
        
        for (var i = 0; i < body.length; i++)
        {
            objects.push(factory(body[i]));
        }

        return objects;
    }

    handleError (error: Response | any) {
        console.log(error);
        return Observable.throw(error.json() || 'Server error');
    }
}
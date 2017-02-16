import { Injectable }                                   from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers }           from '@angular/http';
import { Observable }                                   from 'rxjs/Observable';
import { UserService }                                  from '../services/UserService';

@Injectable()
export class MainHttpService
{
    constructor(private http: Http, private userService: UserService){}
    get (url:string, params?: [{ name: string, value: any}]): Observable<Response>
    {
        let request:RequestOptionsArgs = {};
        request.search = "username=" + this.userService.getUserName() + "&token="+ this.userService.getToken();
        if (params)
        {
            let first:boolean = false;
            for (let item of params)
            {
                request.search+= "&" + item.name + "=" + item.value;        
                if (first)
                {
                    first = false
                }
            }
        }

        request.headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.get(url, request);
    }
}
import { Injectable }                                   from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers }           from '@angular/http';
import { Observable }                                   from 'rxjs/Observable';
import { UserService }                                  from '../services/UserService';

@Injectable()
export class MainHttpService
{
    constructor(private http: Http, private userService: UserService, private baseUrl:string){}
    get (url:string, params?: [{ name: string, value: any}]): Observable<Response>
    {
        let request:RequestOptionsArgs = {};
        request.search = "1=1";
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

        request.headers = new Headers({ 'Content-Type': 'application/json' , 'x-username' : this.userService.getUserName(), 'x-token' : this.userService.getToken()});

        return this.http.get(this.baseUrl + url, request);
    }

    static extractFromJsonData(res: Response, factory: (object: {}) => any)
    {
        let body:[{}] = res.json();
        let objects:any[] = [];
        
        for (var i = 0; i < body.length; i++)
        {
            objects.push(factory(body[i]));
        }

        return objects;
    }

    handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);

        return Observable.throw(errMsg);
    }
}
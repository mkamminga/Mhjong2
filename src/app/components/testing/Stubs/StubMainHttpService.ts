import { Injectable }                                   from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers }           from '@angular/http';
import { Observable }                                   from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { UserService }                                  from '../../../services/UserService';

@Injectable()
export class MockMainHttpService
{
    constructor(private http: Http, private userService: UserService, private baseUrl:string){}
    get (url:string, params?: [{ name: string, value: any}]): Observable<Response>
    {
        return new Observable<Response>();
    }

    post (url:string, params: any): Observable<Response>
    {

        return new Observable<Response>();
    }

    extractFromJsonData(res: Response, factory: (object: {}) => any)
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
        console.log(error);
        return Observable.throw(error.json() || 'Server error');
    }
}
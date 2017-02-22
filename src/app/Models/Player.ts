export class Player {
    constructor(public _id:string, public id:string, public name:string) {
        if (_id)
        {
            this.id = _id;
        }
    }
}
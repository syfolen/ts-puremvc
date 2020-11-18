
module puremvc {

    export class Observer {

        args: any[] = null;

        name: string = null;

        caller: Object = null;

        method: Function = null;

        priority: number = 0;

        receiveOnce: boolean = false;
    }
}
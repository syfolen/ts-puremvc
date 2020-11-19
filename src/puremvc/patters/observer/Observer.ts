
module puremvc {
    /**
     * 观察者对象（内置对象，请勿在外部持有）
     * export
     */
    export class Observer {

        args: any[] = null;

        name: string = null;

        caller: Object = null;

        method: Function = null;

        priority: number = 0;

        receiveOnce: boolean = false;
    }
}

module puremvc {
    /**
     * 观察者对象
     */
    export class Observer implements IObserver {

        args: any[] = null;

        name: string = null;

        caller: Object = null;

        method: Function = null;

        priority: number = 0;

        receiveOnce: boolean = false;
    }
}
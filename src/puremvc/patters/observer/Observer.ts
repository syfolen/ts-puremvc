
module puremvc {
    /**
     * 观察者对象
     */
    export class Observer implements IObserver {

        args: any[] = null;

        name: string = null;

        caller: any = null;

        method: Function = null;

        priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID;

        receiveOnce: boolean = false;
    }
}
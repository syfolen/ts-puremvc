
module puremvc {
    /**
     * 观察者对象
     */
    export interface IObserver {

        args: any[];

        name: string;

        caller: any;

        method: Function;

        priority: suncom.EventPriorityEnum;

        receiveOnce: boolean;
    }
}
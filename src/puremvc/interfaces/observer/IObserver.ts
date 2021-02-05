
module puremvc {
    /**
     * 观察者对象
     */
    export interface IObserver {

        args: any[];

        name: string;

        caller: Object;

        method: Function;

        priority: number;

        receiveOnce: boolean;
    }
}
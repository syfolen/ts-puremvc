
module puremvc {
    /**
     * 观察者对象（内置对象，请勿在外部持有）
     * export
     */
    export class Observer {

        name: string = null;

        caller: any = null;

        method: Function = null;

        option: IOption = null;

        priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID;

        receiveOnce: boolean = false;
    }
}
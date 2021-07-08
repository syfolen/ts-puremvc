
module puremvc {
    /**
     * 观察者对象
     */
    export interface IObserver {
        /**
         * 参数列表
         */
        args: any[];

        /**
         * 事件名称
         */
        name: string;

        /**
         * 回调对象 
         */
        caller: Object;

        /**
         * 回调方法
         */
        method: Function;

        /**
         * 事件优先级
         */
        priority: suncom.EventPriorityEnum;

        /**
         * 是否为一次性事件
         */
        receiveOnce: boolean;
    }
}
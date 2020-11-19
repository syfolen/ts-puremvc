
module puremvc {
    /**
     * export
     */
    export class Mediator extends Notifier {

        private $mediatorName: string = null;
        private $notificationInterests: Observer[] = [];

        /**
         * 未初始化时值为：null
         * export
         */
        protected $viewComponent: any = null;

        /**
         * export
         */
        constructor(name: string, viewComponent?: any) {
            super();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`无效的中介者对象名字`);
            }
            this.$mediatorName = name;
            this.$viewComponent = viewComponent || null;
        }

        getMediatorName(): string {
            return this.$mediatorName;
        }

        listNotificationInterests(): void {

        }

        /**
         * 移除感兴趣的事件列表（内置方法，请勿调用）
         */
        removeNotificationInterests(): void {
            for (let i: number = 0; i < this.$notificationInterests.length; i++) {
                const observer: Observer = this.$notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        /**
         * 注册事件回调
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数，默认为：1
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         * export
         */
        protected $handleNotification(name: string, method: Function, priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID, option?: number | CareModuleID | any[] | IOption): void {
            const observer: Observer = this.facade.registerObserver(name, method, this, void 0, priority, option);
            observer && this.$notificationInterests.push(observer);
        }

        /**
         * 注册回调（此时己注册）
         * export
         */
        onRegister(): void {

        }

        /**
         * 移除回调（此时己移除）
         * export
         */
        onRemove(): void {

        }

        /**
         * export
         */
        getViewComponent(): any {
            return this.$viewComponent;
        }

        /**
         * export
         */
        setViewComponent(view: any): void {
            this.$viewComponent = view || null;
        }
    }
}

module puremvc {
    /**
     * export
     */
    export class Mediator<T> extends Notifier implements IMediator<T> {
        /**
         * 实例名字
         */
        private $var_mediatorName: string = null;

        /**
         * 视图感兴趣的通知列表
         */
        private $var_notificationInterests: IObserver[] = [];

        /**
         * 视图组件实例，未初始化时值为：null
         * export
         */
        protected $viewComponent: T = null;

        /**
         * export
         */
        constructor(name: string, viewComponent?: T) {
            super();
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error(`无效的中介者对象名字`);
            }
            this.$var_mediatorName = name;
            this.$viewComponent = viewComponent || null;
        }

        /**
         * 指定通知处理函数，接口说明请参考: Facade.registerObserver
         * export
         */
        protected $handleNotification(name: string, method: Function, priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID, args?: any[]): void {
            const observer: IObserver = View.inst.registerObserver(name, method, this, void 0, priority, args);
            observer && this.$var_notificationInterests.push(observer);
        }

        func_getMediatorName(): string {
            return this.$var_mediatorName;
        }

        /**
         * export
         */
        listNotificationInterests(): void {

        }

        func_removeNotificationInterests(): void {
            for (let i: number = 0; i < this.$var_notificationInterests.length; i++) {
                const observer: IObserver = this.$var_notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        /**
         * export
         */
        onRegister(): void {

        }

        /**
         * export
         */
        onRemove(): void {

        }

        /**
         * export
         */
        getViewComponent(): T {
            return this.$viewComponent;
        }

        /**
         * export
         */
        setViewComponent(view: T): void {
            this.$viewComponent = view || null;
        }

        /**
         * export
         */
        hasViewComponent(): boolean {
            return this.$viewComponent !== null;
        }
    }
}

module puremvc {
    /**
     * 视图中介者
     * export
     */
    export class Mediator<T> extends Notifier {
        /**
         * 实例名字（内置属性，请勿操作）
         */
        private $mediatorName: string = null;

        /**
         * 视图感兴趣的通知列表（内置属性，请勿操作）
         */
        private $notificationInterests: Observer[] = [];

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
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`无效的中介者对象名字`);
            }
            this.$mediatorName = name;
            this.$viewComponent = viewComponent || null;
        }

        /**
         * 获取实例名字
         */
        getMediatorName(): string {
            return this.$mediatorName;
        }

        /**
         * 列举感兴趣的通知
         * export
         */
        listNotificationInterests(): void {

        }

        /**
         * 移除感兴趣的通知列表（内置方法，请勿调用）
         */
        removeNotificationInterests(): void {
            for (let i: number = 0; i < this.$notificationInterests.length; i++) {
                const observer: Observer = this.$notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        /**
         * 指定通知处理函数，接口说明请参考: Facade.registerObserver
         * export
         */
        protected $handleNotification(name: string, method: Function, priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID, option?: number | CareModuleID | any[] | IOption): void {
            const observer: Observer = View.inst.registerObserver(name, method, this, void 0, priority, option);
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
         * 获取视图组件实例
         * export
         */
        getViewComponent(): T {
            return this.$viewComponent;
        }

        /**
         * 指定视图组件实例
         * export
         */
        setViewComponent(view: T): void {
            this.$viewComponent = view || null;
        }
    }
}
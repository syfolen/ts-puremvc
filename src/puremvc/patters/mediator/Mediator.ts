
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
                throw Error("Invalid mediator name: " + name);
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
         * export
         */
        protected $handleNotification(name: string, method: Function, priority?: number, args?: any[]): void {
            const observer: Observer = View.inst.registerObserver(name, method, this, void 0, priority, args);
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
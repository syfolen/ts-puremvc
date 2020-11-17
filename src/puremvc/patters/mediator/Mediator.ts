
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
            this.$mediatorName = name || null;
            this.$viewComponent = viewComponent || null;
        }

        getMediatorName(): string {
            return this.$mediatorName;
        }

        listNotificationInterests(): void {

        }

        removeNotificationInterests(): void {
            for (let i: number = 0; i < this.$notificationInterests.length; i++) {
                const observer: Observer = this.$notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        /**
         * export
         */
        protected $handleNotification(name: string, method: Function, receiveOnce?: boolean, priority?: number, args?: any[]): void {
            const observer: Observer = View.inst.registerObserver(name, method, this, receiveOnce, priority, args);
            observer && this.$notificationInterests.push(observer);
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
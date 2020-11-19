
module puremvc {
    /**
     * 通知派发者
     * export
     */
    export class Notifier {
        /**
         * PureMVC外观引用
         * export
         */
        protected readonly facade: Facade = Facade.getInstance();
    }
}
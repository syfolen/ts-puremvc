
module puremvc {
    /**
     * export
     */
    export class Notifier implements INotifier {
        /**
         * PureMVC外观引用
         * export
         */
        protected readonly facade: IFacade = Facade.getInstance();
    }
}
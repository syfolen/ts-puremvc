
module puremvc {
    /**
     * export
     */
    export class Notifier implements INotifier {
        /**
         * PureMVC外观引用
         */
        private readonly $var_facade: IFacade = Facade.getInstance();

        /**
         * 是否己销毁
         * export
         */
        protected $destroyed: boolean = false;

        /**
         * export
         */
        destroy(): void {
            this.$destroyed = true;
        }

        /**
         * 获取PureMVC外观引用
         * export
         */
        protected get facade(): IFacade {
            return this.$var_facade;
        }

        /**
         * export
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}
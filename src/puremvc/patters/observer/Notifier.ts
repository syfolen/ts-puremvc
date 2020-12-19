
module puremvc {
    /**
     * export
     */
    export class Notifier implements INotifier {
        /**
         * PureMVC外观引用
         */
        private readonly $var_facade: Facade = Facade.getInstance();

        /**
         * MsgQ消息模块标识，默认为: MMI
         */
        private $var_msgQMod: suncore.MsgQModEnum = suncore.MsgQModEnum.MMI;

        /**
         * 是否己销毁
         * export
         */
        protected $destroyed: boolean = false;

        /**
         * export
         */
        constructor(msgQMod?: suncore.MsgQModEnum) {
            if (msgQMod !== void 0) {
                this.$var_msgQMod = msgQMod;
            }
        }

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
        protected get facade(): Facade {
            MutexLocker.active(this.$var_msgQMod);
            return this.$var_facade;
        }

        /**
         * export
         */
        get msgQMod(): suncore.MsgQModEnum {
            return this.$var_msgQMod;
        }

        /**
         * export
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}
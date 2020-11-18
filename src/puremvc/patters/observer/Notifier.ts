
module puremvc {
    /**
     * export
     */
    export class Notifier {
        /**
         * MsgQ消息模块标识，默认为MMI
         */
        private $msgQMod: suncore.MsgQModEnum = suncore.MsgQModEnum.MMI;

        /**
         * PureMVC外观引用
         */
        private $facade: Facade = Facade.getInstance();

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
                this.$msgQMod = msgQMod;
            }
        }

        /**
         * 销毁对象
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
            MutexLocker.active(this.$msgQMod);
            return this.$facade;
        }

        /**
         * 获取消息派发者MsgQ消息模块标识
         * export
         */
        get msgQMod(): suncore.MsgQModEnum {
            return this.$msgQMod;
        }

        /**
         * 是否己销毁
         * export
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}
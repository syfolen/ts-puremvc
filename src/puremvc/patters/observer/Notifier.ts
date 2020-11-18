
module puremvc {
    /**
     * export
     */
    export class Notifier {
        /**
         * MsgQ��Ϣģ���ʶ��Ĭ��ΪMMI
         */
        private $msgQMod: suncore.MsgQModEnum = suncore.MsgQModEnum.MMI;

        /**
         * PureMVC�������
         */
        private $facade: Facade = Facade.getInstance();

        /**
         * �Ƿ�����
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
         * ���ٶ���
         * export
         */
        destroy(): void {
            this.$destroyed = true;
        }

        /**
         * ��ȡPureMVC�������
         * export
         */
        protected get facade(): Facade {
            MutexLocker.active(this.$msgQMod);
            return this.$facade;
        }

        /**
         * ��ȡ��Ϣ�ɷ���MsgQ��Ϣģ���ʶ
         * export
         */
        get msgQMod(): suncore.MsgQModEnum {
            return this.$msgQMod;
        }

        /**
         * �Ƿ�����
         * export
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}
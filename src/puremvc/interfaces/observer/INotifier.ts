
module puremvc {
    /**
     * 通知派发者
     * export
     */
    export interface INotifier {

        /**
         * 销毁对象
         * export
         */
        destroy(): void;

        /**
         * 获取消息派发者MsgQ消息模块标识
         * export
         */
        readonly msgQMod: suncore.MsgQModEnum;

        /**
         * 是否己销毁
         * export
         */
        readonly destroyed: boolean;
    }
}
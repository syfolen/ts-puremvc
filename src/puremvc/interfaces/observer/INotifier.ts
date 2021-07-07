
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
         * 是否己销毁
         * export
         */
        readonly destroyed: boolean;
    }
}

module puremvc {
    /**
     * 注册事件时的可选参数
     * export
     */
    export interface IOption {
        /**
         * 消息关心的模块，默认：无
         * export
         */
        careStatMod?: suncore.ModuleEnum;

        /**
         * 消息响应间隔，最小为：1
         * export
         */
        delay?: number;

        /**
         * 参数列表
         * export
         */
        args?: any[];

        /**
         * 间隔计数器
         */
        $_counter?: number;
    }
}
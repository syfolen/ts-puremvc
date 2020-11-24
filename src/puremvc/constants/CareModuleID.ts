
module puremvc {
    /**
     * 消息关心的模块ID
     * 说明：
     * 1. 当你在非系统模块中监听了系统消息，但又不希望在该模块未激活时响应消息时，则可在监听消息时指定消息关心的模块ID来达到此目的
     * export
     */
    export enum CareModuleID {
        /**
         * 无
         */
        $_NONE = 0xFFFF,

        /**
         * suncore.ModuleEnum.CUSTOM
         * export
         */
        CUSTOM,

        /**
         * suncore.ModuleEnum.TIMELINE
         * export
         */
        TIMELINE
    }
}
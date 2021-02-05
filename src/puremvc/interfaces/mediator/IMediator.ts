
module puremvc {
    /**
     * 视图中介者
     * export
     */
    export interface IMediator<T> extends INotifier {

        /**
         * 获取实例名字
         */
        func_getMediatorName(): string;

        /**
         * 列举感兴趣的通知
         * export
         */
        listNotificationInterests(): void;

        /**
         * 移除感兴趣的通知列表
         */
        func_removeNotificationInterests(): void;

        /**
         * 注册回调（此时己注册）
         * export
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         * export
         */
        onRemove(): void;

        /**
         * 获取视图组件实例
         * export
         */
        getViewComponent(): T;

        /**
         * 指定视图组件实例
         * export
         */
        setViewComponent(view: T): void;
    }
}
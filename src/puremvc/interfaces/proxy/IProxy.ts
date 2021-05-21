
module puremvc {
    /**
     * 数据代理类
     * export
     */
    export interface IProxy<T> extends INotifier {

        /**
         * 获取代理名字
         */
        func_getProxyName(): string;

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
         * 获取数据模型
         * export
         */
        getData(): T;

        /**
         * 指定数据模型
         * export
         */
        setData(data: T): void;

        /**
         * 将数据转化成 boolean 返回
         * export
         */
        hasData(): boolean;

        /**
         * 只要数据不为 void 0 就返回 true
         * export
         */
        hasDataStrictly(): boolean;
    }
}
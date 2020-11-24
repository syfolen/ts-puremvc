
module puremvc {
    /**
     * 数据代理类
     * export
     */
    export class Proxy<T> extends Notifier {
        /**
         * 代理名字
         */
        private $_proxyName: string = null;

        /**
         * 数据模型，未初始化时值为：void 0
         * export
         */
        protected $data: T = void 0;

        /**
         * export
         */
        constructor(name: string, data?: T) {
            super();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`无效的模型类名字`);
            }
            this.$data = data;
            this.$_proxyName = name;
        }

        /**
         * 获取代理名字
         */
        $_getProxyName(): string {
            return this.$_proxyName || null;
        }

        /**
         * 注册回调（此时己注册）
         * export
         */
        onRegister(): void {

        }

        /**
         * 移除回调（此时己移除）
         * export
         */
        onRemove(): void {

        }

        /**
         * 获取数据模型
         * export
         */
        getData(): T {
            return this.$data;
        }

        /**
         * 指定数据模型
         * export
         */
        setData(data: T): void {
            this.$data = data;
        }
    }
}
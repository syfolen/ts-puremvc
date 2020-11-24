
module puremvc {
    /**
     * 数据代理类
     * export
     */
    export class Proxy<T> extends Notifier {
        /**
         * 代理名字
         */
        private $var_proxyName: string = null;

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
                throw Error(`Invalid proxy name`);
            }
            this.$data = data;
            this.$var_proxyName = name;
        }

        /**
         * 获取代理名字
         */
        func_getProxyName(): string {
            return this.$var_proxyName || null;
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
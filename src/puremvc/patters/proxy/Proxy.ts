
module puremvc {
    /**
     * export
     */
    export class Proxy<T> extends Notifier implements IProxy<T> {
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
                throw Error(`无效的模型类名字`);
            }
            this.$data = data;
            this.$var_proxyName = name;
        }

        func_getProxyName(): string {
            return this.$var_proxyName || null;
        }

        /**
         * export
         */
        onRegister(): void {

        }

        /**
         * export
         */
        onRemove(): void {

        }

        /**
         * export
         */
        getData(): T {
            return this.$data;
        }

        /**
         * export
         */
        setData(data: T): void {
            this.$data = data;
        }
    }
}
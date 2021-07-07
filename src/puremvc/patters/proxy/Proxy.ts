
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
         * 当前锁定的 json 对象
         */
        private $var_lockData: any = null;

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
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error(`无效的模型类名字`);
            }
            this.$data = data;
            this.$var_proxyName = name;
            this.$lockJsonData(data);
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
            if (this.$var_lockData === null) {
                this.$lockJsonData(data);
            }
        }

        /**
         * 将数据转化成 boolean 返回
         * export
         */
        hasData(): boolean {
            return this.$data ? true : false;
        }

        /**
         * 只要数据不为 void 0 就返回 true
         * export
         */
        hasDataStrictly(): boolean {
            return this.$data !== void 0;
        }

        /**
         * 锁定数据源
         * export
         */
        protected $lockJsonData(data: any): void {
            if (data instanceof Object && data instanceof Array === false) {
                this.$var_lockData = data;
            }
        }

        /**
         * 为 json 对象设置默认的键值
         * 说明：
         * 1. 若值己存在，则不会被设置
         * 2. 设用此方法
         * export
         */
        protected $setDefaultJsonValue(key: string, value: any): void {
            if (this.$var_lockData[key] === void 0) {
                this.$var_lockData[key] = value;
            }
        }
    }
}
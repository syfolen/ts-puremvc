
module puremvc {
    /**
     * export
     */
    export class Proxy extends Notifier {

        private $proxyName: string = null;

        /**
         * 未初始化时值为：void 0
         * export
         */
        protected $data: any = void 0;

        /**
         * export
         */
        constructor(name: string, data?: any) {
            super();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Invalid proxy name: " + name);
            }
            this.$data = data;
            this.$proxyName = name;
        }

        getProxyName(): string {
            return this.$proxyName || null;
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
         * export
         */
        getData(): any {
            return this.$data;
        }

        /**
         * export
         */
        setData(data: any): void {
            this.$data = data;
        }
    }
}
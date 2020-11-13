
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
            this.$proxyName = name || null;
        }

        getProxyName(): string {
            return this.$proxyName || null;
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
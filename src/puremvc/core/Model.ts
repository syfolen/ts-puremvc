
module puremvc {
    /**
     * 模型类（数据集合）
     */
    export class Model {

        static inst: Model = null;

        /**
         * 模型集合
         */
        private $proxies: { [name: string]: Proxy<any> } = {};

        constructor() {
            if (Model.inst !== null) {
                throw Error(`Model singleton already constructed!`);
            }
            Model.inst = this;
        }

        registerProxy(proxy: Proxy<any>): void {
            const name: string = proxy.getProxyName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Register invalid proxy`);
            }
            if (this.hasProxy(name) === true) {
                throw Error(`Register duplicate proxy: ${name}`);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        }

        removeProxy(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Remove invalid proxy`);
            }
            if (this.hasProxy(name) === false) {
                throw Error(`Remove non-existent proxy: ${name}`);
            }
            const proxy: Proxy<any> = this.$proxies[name];
            delete this.$proxies[name];
            proxy.onRemove();
        }

        retrieveProxy(name: string): Proxy<any> {
            return this.$proxies[name] || null;
        }

        hasProxy(name: string): boolean {
            return this.$proxies[name] !== void 0;
        }
    }
}
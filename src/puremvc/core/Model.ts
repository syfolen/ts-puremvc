
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
                throw Error(`重复构建模型类！！！`);
            }
            Model.inst = this;
        }

        registerProxy(proxy: Proxy<any>): void {
            const name: string = proxy.getProxyName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`注册无效的模型类`);
            }
            if (this.hasProxy(name) === true) {
                throw Error(`重复注册模型类：${name}`);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        }

        removeProxy(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`移除无效的模型类`);
            }
            if (this.hasProxy(name) === false) {
                throw Error(`移除不存在的模型类：${name}`);
            }
            const proxy: Proxy<any> = this.$proxies[name];
            delete this.$proxies[name];
            proxy.onRemove();
        }

        retrieveProxy(name: string): Proxy<any> {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error(`非MMI模块禁用接口`);
            }
            return this.$proxies[name] || null;
        }

        hasProxy(name: string): boolean {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error(`非MMI模块禁用接口`);
            }
            return this.$proxies[name] !== void 0;
        }
    }
}
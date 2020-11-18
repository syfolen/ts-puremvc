
module puremvc {
    /**
     * 模型类（数据集合）
     */
    export class Model {

        static inst: Model = null;

        private $proxies: { [name: string]: Proxy } = {};

        constructor() {
            if (Model.inst !== null) {
                throw Error("重复构建模型类！！！");
            }
            Model.inst = this;
        }

        registerProxy(proxy: Proxy): void {
            const name: string = proxy.getProxyName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("注册无效的Proxy");
            }
            if (this.hasProxy(name) === true) {
                throw Error("重复注册Proxy：" + name);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        }

        removeProxy(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("移除无效的Proxy");
            }
            if (this.hasProxy(name) === false) {
                throw Error("移除不存在的Proxy：" + name);
            }
            const proxy: Proxy = this.$proxies[name];
            delete this.$proxies[name];
            proxy.onRemove();
        }

        retrieveProxy(name: string): Proxy {
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
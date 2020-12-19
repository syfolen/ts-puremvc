
module puremvc {

    export class Model implements IModel {

        static inst: IModel = null;

        /**
         * 模型集合
         */
        private $proxies: { [name: string]: IProxy<any> } = {};

        constructor() {
            if (Model.inst !== null) {
                throw Error(`重复构建模型类！！！`);
            }
            Model.inst = this;
        }

        registerProxy(proxy: IProxy<any>): void {
            const name: string = proxy.func_getProxyName();
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
            const proxy: IProxy<any> = this.$proxies[name];
            delete this.$proxies[name];
            proxy.onRemove();
        }

        retrieveProxy(name: string): IProxy<any> {
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
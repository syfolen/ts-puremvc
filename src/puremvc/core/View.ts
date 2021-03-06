
module puremvc {
    /**
     * 视图类（视图集合）
     */
    export class View implements IView {

        static inst: IView = null;

        /**
         * 观察者对象对象池
         */
        private $pool: IObserver[] = [];
        /**
         * 命令锁集合，用于防止注册与注销行为对正在响应的观察者列表产生干扰
         */
        private $lockers: { [name: string]: boolean } = {};
        /**
         * 观察者对象集合
         */
        private $observers: { [name: string]: IObserver[] } = {};

        /**
         * 通知是否己取消
         */
        private $isCanceled: boolean = false;
        /**
         * 己响应的一次性观察者列表
         */
        private $onceObservers: IObserver[] = [];

        /**
         * 视图中介者对象集合
         */
        private $mediators: { [name: string]: IMediator<any> } = {};

        constructor() {
            if (View.inst !== null) {
                throw Error(`重复构建视图类！！！`);
            }
            View.inst = this;
        }

        registerObserver(name: string, method: Function, caller: Object, receiveOnce: boolean = false, priority: number = 2, args: any[] = null): IObserver {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`注册无效的监听`);
            }
            if (method === void 0 || method === null) {
                throw Error(`注册无效的监听回调：${name}`);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: IObserver[] = this.$observers[name];
            // 若列表不存在，则新建
            if (observers === void 0) {
                observers = this.$observers[name] = [];
            }
            // 解锁并复制被锁定的列表
            else if (this.$lockers[name] === true) {
                this.$lockers[name] = false;
                this.$observers[name] = observers = observers.slice();
            }

            let index: number = -1;
            for (let i: number = 0; i < observers.length; i++) {
                const observer: IObserver = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    Facade.DEBUG === true && console.warn(`忽略重复注册的监听 name:${name}`);
                    return null;
                }
                // 优先级高的通知先执行
                if (index === -1 && observer.priority < priority) {
                    index = i;
                }
            }

            const observer: IObserver = this.$pool.length > 0 ? this.$pool.pop() : new Observer();
            observer.args = args;
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.priority = priority;
            observer.receiveOnce = receiveOnce;
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        }

        removeObserver(name: string, method: Function, caller: Object): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`移除无效的监听`);
            }
            if (method === void 0 || method === null) {
                throw Error(`移除无效的监听回调：${name}`);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: IObserver[] = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            // 解锁并复制被锁定的列表
            if (this.$lockers[name] === true) {
                this.$lockers[name] = false;
                this.$observers[name] = observers = observers.slice();
            }

            for (let i: number = 0; i < observers.length; i++) {
                const observer: IObserver = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observer.args = observer.caller = observer.method = null;
                    this.$pool.push(observers.splice(i, 1)[0]);
                    break;
                }
            }

            // 移除空列表
            if (observers.length === 0) {
                delete this.$lockers[name];
                delete this.$observers[name];
            }
        }

        hasObserver(name: string, method: Function, caller: Object): boolean {
            if (method === void 0) { method = null; }
            if (caller === void 0) { caller = null; }
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`查询无效的监听`);
            }
            if (method === null && caller === null) {
                throw Error(`method和caller不允许同时为空`);
            }
            let observers: IObserver[] = this.$observers[name];
            if (observers === void 0) {
                return false;
            }
            for (let i: number = 0; i < observers.length; i++) {
                const observer: IObserver = observers[i];
                if (method === null) {
                    if (observer.caller === caller) {
                        return true;
                    }
                }
                else if (caller === null) {
                    if (observer.method === method) {
                        return true;
                    }
                }
                else if (observer.method === method && observer.caller === caller) {
                    return true;
                }
            }
            return false;
        }

        notifyObservers(name: string, data?: any, cancelable: boolean = true): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`派发无效的通知`);
            }
            const observers: IObserver[] = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            // 锁定列表
            this.$lockers[name] = true;

            // 记录历史通知状态
            const isCanceled: boolean = this.$isCanceled;
            // 标记通知未取消
            this.$isCanceled = false;

            for (let i: number = 0; i < observers.length; i++) {
                const observer: IObserver = observers[i];
                // 一次性观察者入栈
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                const args: any = observer.args === null ? data : observer.args.concat(data);
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, args);
                }
                else if (args instanceof Array) {
                    observer.method.apply(observer.caller, args);
                }
                else {
                    observer.method.call(observer.caller, args);
                }
                // 通知被取消
                if (this.$isCanceled) {
                    // 通知允许被取消
                    if (cancelable === true) {
                        break;
                    }
                    console.error(`尝试取消不可被取消的通知：${name}`);
                    this.$isCanceled = false;
                }
            }

            // 回归历史通知状态
            this.$isCanceled = isCanceled;
            // 解锁
            this.$lockers[name] = false;

            // 注销一次性观察者
            while (this.$onceObservers.length > 0) {
                const observer: IObserver = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        notifyCancel(): void {
            this.$isCanceled = true;
        }

        registerMediator(mediator: IMediator<any>): void {
            const name: string = mediator.func_getMediatorName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`注册无效的中介者对象`);
            }
            if (this.hasMediator(name) === true) {
                throw Error(`重复注册中介者对象${name}`);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        }

        removeMediator(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`移除无效的中介者对象`);
            }
            if (this.hasMediator(name) === false) {
                throw Error(`移除不存在的中介者对象${name}`);
            }
            const mediator: IMediator<any> = this.$mediators[name];
            delete this.$mediators[name];
            mediator.func_removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): IMediator<any> {
            return this.$mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            return this.$mediators[name] !== void 0;
        }
    }

}
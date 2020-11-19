
module puremvc {
    /**
     * 视图类（视图集合）
     */
    export class View {

        static inst: View = null;

        /**
         * 观察者对象对象池
         */
        private $pool: Observer[] = [];
        /**
         * 命令锁集合，用于防止注册与注销行为对正在响应的观察者列表产生干扰
         */
        private $lockers: { [name: string]: boolean } = {};
        /**
         * 观察者对象集合
         */
        private $observers: { [name: string]: Observer[] } = {};

        /**
         * 通知是否己取消
         */
        private $isCanceled: boolean = false;
        /**
         * 己响应的一次性观察者列表
         */
        private $onceObservers: Observer[] = [];

        /**
         * 视图中介者对象集合
         */
        private $mediators: { [name: string]: Mediator<any> } = {};

        constructor() {
            if (View.inst !== null) {
                throw Error(`View singleton already constructed!`);
            }
            View.inst = this;
        }

        registerObserver(name: string, method: Function, caller: Object, receiveOnce: boolean = false, priority: number = 2, args: any[] = null): Observer {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Register invalid observer`);
            }
            if (method === void 0 || method === null) {
                throw Error(`Register invalid observer method: ${name}`);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: Observer[] = this.$observers[name];
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
                const observer: Observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    return null;
                }
                // 优先级高的通知先执行
                if (index === -1 && observer.priority < priority) {
                    index = i;
                }
            }

            const observer: Observer = this.$pool.length > 0 ? this.$pool.pop() : new Observer();
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
                throw Error(`Remove invalid observer`);
            }
            if (method === void 0 || method === null) {
                throw Error(`Remove invalid observer method: ${name}`);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: Observer[] = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            // 解锁并复制被锁定的列表
            if (this.$lockers[name] === true) {
                this.$lockers[name] = false;
                this.$observers[name] = observers = observers.slice();
            }

            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observers.splice(i, 1);
                    this.$pool.push(observer);
                    break;
                }
            }

            // 移除空列表
            if (observers.length === 0) {
                delete this.$lockers[name];
                delete this.$observers[name];
            }
        }

        notifyObservers(name: string, data?: any, cancelable: boolean = true): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Notify invalid command`);
            }
            const observers: Observer[] = this.$observers[name];
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
                const observer: Observer = observers[i];
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
                const observer: Observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        notifyCancel(): void {
            this.$isCanceled = true;
        }

        registerMediator(mediator: Mediator<any>): void {
            const name: string = mediator.getMediatorName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Register invalid mediator`);
            }
            if (this.hasMediator(name) === true) {
                throw Error(`Register duplicate mediator: ${name}`);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        }

        removeMediator(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`Remove invalid mediator`);
            }
            if (this.hasMediator(name) === false) {
                throw Error(`Remove non-existent mediator: ${name}`);
            }
            const mediator: Mediator<any> = this.$mediators[name];
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): Mediator<any> {
            return this.$mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            return this.$mediators[name] !== void 0;
        }
    }

}
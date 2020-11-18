
module puremvc {
    /**
     * 视图类（视图集合）
     */
    export class View {

        static inst: View = null;

        private $mediators: IDictionary<Mediator> = {};

        private $workings: IDictionary<boolean> = {};
        private $observers: IDictionary<Observer[]> = {};

        private $isCanceled: boolean = false;
        private $onceObservers: Observer[] = [];

        private $recycle: Observer[] = [];

        constructor() {
            if (View.inst !== null) {
                throw Error("View singleton already constructed!");
            }
            View.inst = this;
        }

        registerObserver(name: string, method: Function, caller: Object, receiveOnce: boolean = false, priority: number = 2, args: any[] = null): Observer {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Register invalid observer: " + name);
            }
            if (method === void 0 || method === null) {
                throw Error("Register invalid observer method: " + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: Observer[] = this.$observers[name];
            // 若列表不存在，则新建
            if (observers === void 0) {
                observers = this.$observers[name] = [];
            }
            // 若列表正在工作，则复制列表
            else if (this.$workings[name] === true) {
                // 标记为未在工作
                this.$workings[name] = false;
                this.$observers[name] = observers = observers.slice();
            }

            let index: number = -1;
            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observer.args = args;
                    const b0: boolean = observer.priority === priority;
                    const b1: boolean = observer.receiveOnce === receiveOnce;
                    if (b0 === false || b1 === false) {
                        const s0: string = b0 === true ? "" : "priority:" + priority;
                        const s1: string = b1 === true ? "" : "receiveOnce:" + receiveOnce;
                        const s2: string = s0 === "" || s1 === "" ? "" : ", ";
                        console.warn("重复注册事件，个别参数未更新：" + `${s0}${s2}${s1}`);
                    }
                    return null;
                }
                // 优先级高的命令先执行
                if (index === -1 && observer.priority < priority) {
                    index = i;
                }
            }

            const observer: Observer = this.$recycle.length > 0 ? this.$recycle.pop() : new Observer();
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
                throw Error("Remove invalid observer: " + name);
            }
            if (method === void 0 || method === null) {
                throw Error("Remove invalid observer method: " + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            let observers: Observer[] = this.$observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 若列表正在工作，则复制列表
            if (this.$workings[name] === true) {
                // 标记为未在工作
                this.$workings[name] = false;
                this.$observers[name] = observers = observers.slice();
            }
            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observers.splice(i, 1);
                    this.$recycle.push(observer);
                    break;
                }
            }

            // 移除空列表
            if (observers.length === 0) {
                delete this.$workings[name];
                delete this.$observers[name];
            }
        }

        notifyCancel(): void {
            this.$isCanceled = true;
        }

        /**
         * @cancelable: 事件是否允许被取消，默认为: true
         */
        notifyObservers(name: string, args?: any, cancelable: boolean = true): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Notify invalid command: " + name);
            }
            const observers: Observer[] = this.$observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 标记为正在工作
            this.$workings[name] = true;

            // 记录历史命令状态
            const isCanceled: boolean = this.$isCanceled;
            // 标记当前命令未取消
            this.$isCanceled = false;

            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
                // 一次性命令入栈
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                const params: any = observer.args === null ? args : observer.args.concat(args);
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, params);
                }
                else if (params instanceof Array) {
                    observer.method.apply(observer.caller, params);
                }
                else {
                    observer.method.call(observer.caller, params);
                }
                // 命令被取消
                if (this.$isCanceled) {
                    // 命令允许被取消
                    if (cancelable === true) {
                        break;
                    }
                    console.error("尝试取消不可被取消的命令：" + name);
                    this.$isCanceled = false;
                }
            }
            // 回归历史命令状态
            this.$isCanceled = isCanceled;
            // 标记为未在工作
            this.$workings[name] = false;

            // 注销一次性命令
            while (this.$onceObservers.length > 0) {
                const observer: Observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        registerMediator(mediator: Mediator): void {
            const name: string = mediator.getMediatorName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Register invalid mediator: " + name);
            }
            if (this.hasMediator(name) === true) {
                throw Error("Register duplicate mediator: " + name);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        }

        removeMediator(name: string): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Remove invalid mediator: " + name);
            }
            if (this.hasMediator(name) === false) {
                throw Error("Remove non-existent mediator " + name);
            }
            const mediator: Mediator = this.retrieveMediator(name);
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): Mediator {
            return this.$mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            return this.$mediators[name] !== void 0;
        }
    }

}
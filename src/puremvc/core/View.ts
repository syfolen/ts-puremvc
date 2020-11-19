
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

        /**
         * suncore模块状态集合
         */
        private $modStatMap: { [mod: number]: boolean } = {};

        /**
         * 关心suncore模块状态的命令集合
         */
        private $careStatCmds: { [mod: number]: boolean } = {};

        constructor() {
            if (View.inst !== null) {
                throw Error(`重复构建视图类！！！`);
            }
            View.inst = this;
            this.registerObserver(suncore.NotifyKey.START_TIMELINE, this.$onStartTimeline, this);
            this.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onPauseTimeline, this);
        }

        private $onStartTimeline(mod: suncore.ModuleEnum, pause: boolean): void {
            if (pause === false) {
                this.$modStatMap[mod] = true;
            }
            else {
                this.$modStatMap[mod] = false;
            }
        }

        private $onPauseTimeline(mod: suncore.ModuleEnum, stop: boolean): void {
            this.$modStatMap[mod] = false;
        }

        setCareStatForCmd(cmd: string): void {
            this.$careStatCmds[cmd] = true;
        }

        registerObserver(name: string, method: Function, caller: Object, receiveOnce: boolean = false, priority: suncom.EventPriorityEnum = suncom.EventPriorityEnum.MID, option: number | CareModuleID | any[] | IOption = 1): Observer {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`注册无效的监听`);
            }
            if (method === void 0 || method === null) {
                throw Error(`注册无效的监听回调：${name}`);
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

            // option应当始终为IOption类型的对象
            option = this.$createOption(option);
            if (option.delay === void 0) {
                option.delay = 1;
            }
            if (option.delay < 1) {
                throw Error(`事件响应间隔应当大于0`);
            }
            option.counter = 0;

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
            MutexLocker.create(name, caller);

            const observer: Observer = this.$pool.length > 0 ? this.$pool.pop() : new Observer();
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.option = option;
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

        private $createOption(data: any): IOption {
            if (typeof data === "number") {
                if (data < CareModuleID.NONE) {
                    return {
                        delay: data
                    };
                }
                else {
                    if (data === CareModuleID.CUSTOM) {
                        return {
                            careStatMod: suncore.ModuleEnum.CUSTOM
                        };
                    }
                    else if (data === CareModuleID.TIMELINE) {
                        return {
                            careStatMod: suncore.ModuleEnum.TIMELINE
                        };
                    }
                }
            }
            else if (data instanceof Array) {
                return {
                    args: data
                };
            }
            else {
                return data;
            }
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
                    MutexLocker.release(name, caller);
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
            let observers: Observer[] = this.$observers[name];
            if (observers === void 0) {
                return false;
            }
            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
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

        notifyObservers(name: string, data?: any, cancelable: boolean = true, force: boolean = false): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`派发无效的通知`);
            }
            const observers: Observer[] = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            // 锁定列表
            this.$lockers[name] = true;
            // 锁定模块
            MutexLocker.lock(name);

            // 记录历史通知状态
            const isCanceled: boolean = this.$isCanceled;
            // 标记通知未取消
            this.$isCanceled = false;

            for (let i: number = 0; i < observers.length; i++) {
                const observer: Observer = observers[i];
                const option: IOption = observer.option;
                // 关心模块状态的非强制性消息过滤
                if (this.$careStatCmds[name] === true && force === false) {
                    if (option.careStatMod !== void 0 && this.$modStatMap[option.careStatMod] !== true) {
                        continue;
                    }
                }
                // 一次性观察者入栈
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                if (observer.caller !== null && observer.caller.destroyed === true) {
                    if (suncom && suncom["Common"]) {
                        console.warn(`对象[${suncom["Common"].getQualifiedClassName(observer.caller)}]己销毁，未能响应${name}事件。`);
                    }
                    else {
                        console.warn(`对象己销毁，未能响应${name}事件。`);
                    }
                    continue;
                }

                if (option.delay > 1) {
                    option.counter++;
                    if (option.counter < option.delay) {
                        continue;
                    }
                    option.counter = 0;
                }

                const args: any = option.args ? option.args.concat(data) : data;
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
            // 释放模块
            MutexLocker.unlock(name);

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
            const mediator: Mediator<any> = this.$mediators[name];
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): Mediator<any> {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error(`非MMI模块禁用接口`);
            }
            return this.$mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error(`非MMI模块禁用接口`);
            }
            return this.$mediators[name] !== void 0;
        }
    }

}
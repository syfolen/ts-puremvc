
module puremvc {
    /**
     * 视图类（视图集合）
     */
    export class View {

        static inst: View = null;

        private $pool: Observer[] = [];
        private $lockers: { [name: string]: boolean } = {};
        private $observers: { [name: string]: Observer[] } = {};

        private $isCanceled: boolean = false;
        private $onceObservers: Observer[] = [];

        private $mediators: { [name: string]: Mediator } = {};

        /**
         * suncore模块状态
         */
        private $modStatMap: { [mod: number]: boolean } = {};

        /**
         * 关心suncore模块状态的命令
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

        /**
         * 关心模块状态的命令
         */
        setCareStatForCmd(cmd: string): void {
            this.$careStatCmds[cmd] = true;
        }

        /**
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数，默认为：1
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         * export
         */
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
                    option.counter = observer.option.counter;
                    observer.option = option;
                    const b0: boolean = observer.priority === priority;
                    const b1: boolean = observer.receiveOnce === receiveOnce;
                    if (b0 === false || b1 === false) {
                        const s0: string = b0 === true ? "" : "priority:" + priority;
                        const s1: string = b1 === true ? "" : "receiveOnce:" + receiveOnce;
                        const s2: string = s0 === "" || s1 === "" ? "" : ", ";
                        console.warn(`重复注册事件，个别参数未更新：${s0}${s2}${s1}`);
                    }
                    return null;
                }
                // 优先级高的命令先执行
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
            // 无此类事件
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

        /**
         * 查询是否存在观察者
         * @method: 若为null，则只校验caller
         * @caller: 若为null，则只校验method
         */
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
            // 无此类事件
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

        notifyCancel(): void {
            this.$isCanceled = true;
        }

        /**
         * 通知观察者
         * @args: 参数列表，允许为任意类型的数据
         * @cancelable: 通知是否允许取消，默认为：true
         * @force: 强制响应，默认为：false
         * 说明：
         * 1. 有些事件关心模块状态，在模块未激活的情况下，将force设为true可以强制响应这类事件
         */
        notifyObservers(name: string, args?: any, cancelable: boolean = true, force: boolean = false): void {
            if (isStringNullOrEmpty(name) === true) {
                throw Error(`派发无效的通知`);
            }
            const observers: Observer[] = this.$observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 锁定列表
            this.$lockers[name] = true;
            // 锁定模块
            MutexLocker.lock(name);

            // 记录历史命令状态
            const isCanceled: boolean = this.$isCanceled;
            // 标记当前命令未取消
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
                // 一次性命令入栈
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

                const params: any = option.args ? option.args.concat(args) : args;
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
                    console.error(`尝试取消不可被取消的命令：${name}`);
                    this.$isCanceled = false;
                }
            }
            // 回归历史命令状态
            this.$isCanceled = isCanceled;
            // 解锁
            this.$lockers[name] = false;
            // 释放模块
            MutexLocker.unlock(name);

            // 注销一次性命令
            while (this.$onceObservers.length > 0) {
                const observer: Observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        registerMediator(mediator: Mediator): void {
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
            const mediator: Mediator = this.$mediators[name];
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): Mediator {
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
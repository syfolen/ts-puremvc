/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.

 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * export
 */
module puremvc {
    /**
     * export
     */
    export class Facade {
        /**
         * export
         */
        static inst: Facade = null;

        /**
         * export
         */
        static getInstance(): Facade {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        }

        private $view: View = new View();
        private $model: Model = new Model();
        private $controller: Controller = new Controller();

        constructor() {
            if (Facade.inst !== null) {
                throw Error("重复构建PureMVC外观类！！！");
            }
            Facade.inst = this;
            this.$initializeFacade();
        }

        private $initializeFacade(): void {
            this.$initMsgQ();
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
        }

        /**
         * export
         */
        protected $initMsgQ(): void {
            MutexLocker.scope = new MutexScope();
            MutexLocker.locker = new MutexScope();
            MutexLocker.msgQMap["sun"] = suncore.MsgQModEnum.KAL;
            MutexLocker.msgQMap["MMI"] = suncore.MsgQModEnum.MMI;
        }

        /**
         * export
         */
        protected $initializeModel(): void {

        }

        /**
         * export
         */
        protected $initializeView(): void {

        }

        /**
         * export
         */
        protected $initializeController(): void {

        }

        /**
         * 为MMI层模块注册命令前缀
         * 说明：
         * 1. 只有通过此方法注册过的MsgQ模块才允许使用模型或视图接口
         * export
         */
        protected $regMMICmd(msgQMod: suncore.MsgQModEnum, prefix: string): void {
            this.$regMsgQCmd(msgQMod, prefix);
            MutexLocker.mmiMsgQMap[msgQMod] = true;
        }

        /**
         * 注册MsgQ模块的命令前缀
         * export
         */
        protected $regMsgQCmd(msgQMod: suncore.MsgQModEnum, prefix: string): void {
            MutexLocker.checkPrefix = true;
            MutexLocker.msgQMap[prefix] = msgQMod;
            MutexLocker.msgQCmd[msgQMod] = prefix;
        }

        /**
         * 关心模块状态的命令
         * export
         */
        protected $setCareStatForCmd(cmd: string): void {
            this.$view.setCareStatForCmd(cmd);
        }

        /**
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1，默认为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         * export
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): Observer {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const observer: Observer = this.$view.registerObserver(name, method, caller, receiveOnce, priority, option);
            MutexLocker.deactive();
            return observer;
        }

        /**
         * 移除观察者
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeObserver(name, method, caller);
            MutexLocker.deactive();
        }

        /**
         * 查询是否存在观察者
         * export
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean {
            MutexLocker.deactive();
            return this.$view.hasObserver(name, method, caller);
        }

        /**
         * 注册命令
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1，默认为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         * export
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): void {
            MutexLocker.deactive();
            this.$controller.registerCommand(name, cls, priority, option);
        }

        /**
         * 移除命令
         * export
         */
        removeCommand(name: string): void {
            MutexLocker.deactive();
            this.$controller.removeCommand(name);
        }

        /**
         * 查询是否存在指定命令
         * export
         */
        hasCommand(name: string): boolean {
            MutexLocker.deactive();
            return this.$controller.hasCommand(name);
        }

        /**
         * 注册模型代理
         * export
         */
        registerProxy(proxy: Proxy): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.registerProxy(proxy);
            MutexLocker.deactive();
        }

        /**
         * 移除模型代理
         * export
         */
        removeProxy(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.removeProxy(name);
            MutexLocker.deactive();
        }

        /**
         * 获取模型代理
         * export
         */
        retrieveProxy(name: string): Proxy {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const proxy: Proxy = this.$model.retrieveProxy(name);
            MutexLocker.deactive();
            return proxy;
        }

        /**
         * 查询是否存在指定模型代理
         * export
         */
        hasProxy(name: string): boolean {
            MutexLocker.deactive();
            return this.$model.hasProxy(name);
        }

        /**
         * 注册视图中介者对象
         * export
         */
        registerMediator(mediator: Mediator): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.registerMediator(mediator);
            MutexLocker.deactive();
        }

        /**
         * 移除视图中介者对象
         * export
         */
        removeMediator(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeMediator(name);
            MutexLocker.deactive();
        }

        /**
         * 获取视图中介者对象
         * export
         */
        retrieveMediator(name: string): Mediator {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const mediator: Mediator = this.$view.retrieveMediator(name);
            MutexLocker.deactive();
            return mediator;
        }

        /**
         * 查询是否存在指定视图中介者对象
         * export
         */
        hasMediator(name: string): boolean {
            MutexLocker.deactive();
            return this.$view.hasMediator(name);
        }

        /**
         * 派发命令通知
         * @args: 参数列表，允许为任意类型的数据
         * @cancelable: 通知是否允许取消，默认为：true
         * @force: 强制响应，默认为：false
         * 说明：
         * 1. 有些事件关心模块状态，在模块未激活的情况下，将force设为true可以强制响应这类事件
         * export
         */
        sendNotification(name: string, args?: any, cancelable?: boolean, force?: boolean): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.notifyObservers(name, args, cancelable, force);
            MutexLocker.deactive();
        }

        /**
         * 取消当前命令的派发
         * export
         */
        notifyCancel(): void {
            MutexLocker.deactive();
            this.$view.notifyCancel();
        }
    }
}
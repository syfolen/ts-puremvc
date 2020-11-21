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
     * PureMVC外观类
     * export
     */
    export class Facade {
        /**
         * 调试模式，为true时会输出日志，默认为: true
         * export
         */
        static DEBUG: boolean = true;

        /**
         * 单例
         * export
         */
        static inst: Facade = null;

        /**
         * 获取单例对象
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
                throw Error(`重复构建PureMVC外观类！！！`);
            }
            Facade.inst = this;
            this.$initializeFacade();
        }

        private $initializeFacade(): void {
            this.$initMsgQ();
            this.$initializeModel();
            this.$initializeController();
            this.$initializeView();
        }

        /**
         * 初始化MsgQ配置（优先于模型类）
         * export
         */
        protected $initMsgQ(): void {
            MutexLocker.scope = new MutexScope();
            MutexLocker.locker = new MutexScope();
            MutexLocker.msgQMap["sun"] = suncore.MsgQModEnum.KAL;
            MutexLocker.msgQMap["MMI"] = suncore.MsgQModEnum.MMI;
        }

        /**
         * 初始化模型类（优先于控制类）
         * export
         */
        protected $initializeModel(): void {

        }

        /**
         * 初始化视图类
         * export
         */
        protected $initializeView(): void {

        }

        /**
         * 初始化控制类（优先于视图类）
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
         * 说明：
         * 1. 通过消息前缀来限制消息在模块内传递
         * 2. 每个模块仅允许注册一次
         * export
         */
        protected $regMsgQCmd(msgQMod: suncore.MsgQModEnum, prefix: string): void {
            MutexLocker.checkPrefix = true;
            MutexLocker.msgQMap[prefix] = msgQMod;
            MutexLocker.msgQCmd[msgQMod] = prefix;
        }

        /**
         * 指定关心模块状态的命令
         * export
         */
        protected $setCareStatForCmd(cmd: string): void {
            this.$view.setCareStatForCmd(cmd);
        }

        /**
         * 注册监听
         * @receiveOnce: 是否为一次性监听，默认为: false
         * @priority: 响应优先级，值越大，优先级越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数，默认为：1
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         * 说明：
         * 1. 若需覆盖参数，请先调用removeObserver移除监听后再重新注册
         * export
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): Observer {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const observer: Observer = this.$view.registerObserver(name, method, caller, receiveOnce, priority, option);
            MutexLocker.deactive();
            return observer;
        }

        /**
         * 移除监听
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeObserver(name, method, caller);
            MutexLocker.deactive();
        }

        /**
         * 查询是否存在观察者
         * @method: 若为null，则只校验caller
         * @caller: 若为null，则只校验method
         * export
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean {
            MutexLocker.deactive();
            return this.$view.hasObserver(name, method, caller);
        }

        /**
         * 注册命令
         * @cls: 命令被响应时，会构建cls实例并执行其execute方法
         * @其余参数请参考registerObserver接口
         * 说明：
         * 1. 命令不可重复注册
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
         * 查询是否存在命令
         * export
         */
        hasCommand(name: string): boolean {
            MutexLocker.deactive();
            return this.$controller.hasCommand(name);
        }

        /**
         * 注册数据代理类实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         * export
         */
        registerProxy(proxy: Proxy<any>): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.registerProxy(proxy);
            MutexLocker.deactive();
        }

        /**
         * 移除数据代理类实例
         * export
         */
        removeProxy(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.removeProxy(name);
            MutexLocker.deactive();
        }

        /**
         * 获取数据代理类实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         * export
         */
        retrieveProxy(name: string): Proxy<any> {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const proxy: Proxy<any> = this.$model.retrieveProxy(name);
            MutexLocker.deactive();
            return proxy;
        }

        /**
         * 查询是否存在数据代理类实例
         * export
         */
        hasProxy(name: string): boolean {
            MutexLocker.deactive();
            return this.$model.hasProxy(name);
        }

        /**
         * 注册视图中介者实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         * export
         */
        registerMediator(mediator: Mediator<any>): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.registerMediator(mediator);
            MutexLocker.deactive();
        }

        /**
         * 移除视图中介者实例
         * export
         */
        removeMediator(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeMediator(name);
            MutexLocker.deactive();
        }

        /**
         * 获取视图中介者实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         * export
         */
        retrieveMediator(name: string): Mediator<any> {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const mediator: Mediator<any> = this.$view.retrieveMediator(name);
            MutexLocker.deactive();
            return mediator;
        }

        /**
         * 查询是否存在视图中介者实例
         * export
         */
        hasMediator(name: string): boolean {
            MutexLocker.deactive();
            return this.$view.hasMediator(name);
        }

        /**
         * 派发通知
         * @data: 参数对象，允许为任意类型的数据，传递多个参数时可指定其为数组，若需要传递的data本身就是数组，则需要传递[data]
         * @cancelable: 通知是否允许被取消，默认为: true
         * @force: 强制响应，默认为：false
         * 说明：
         * 1. 有些事件关心模块状态，在模块未激活的情况下，将force设为true可以强制响应这类事件
         * export
         */
        sendNotification(name: string, data?: any, cancelable?: boolean, force?: boolean): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.notifyObservers(name, data, cancelable, force);
            MutexLocker.deactive();
        }

        /**
         * 通知取消
         * 说明：
         * 1. 未响应的回调都将不再执行
         * export
         */
        notifyCancel(): void {
            MutexLocker.deactive();
            this.$view.notifyCancel();
        }
    }
}
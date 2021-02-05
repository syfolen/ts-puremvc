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
    export class Facade implements IFacade {
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
        static getInstance(): IFacade {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        }

        private $var_view: IView = new View();
        private $var_model: IModel = new Model();
        private $var_controller: IController = new Controller();

        constructor() {
            if (Facade.inst !== null) {
                throw Error(`重复构建PureMVC外观类！！！`);
            }
            Facade.inst = this;
            this.$func_initializeFacade();
        }

        private $func_initializeFacade(): void {
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
            MutexLocker.msgQMap["sun"] = suncore.MsgQModEnum.E_KAL;
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
         * export
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, args?: any[]): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.registerObserver(name, method, caller, receiveOnce, priority, args);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.removeObserver(name, method, caller);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean {
            MutexLocker.deactive();
            return this.$var_view.hasObserver(name, method, caller);
        }

        /**
         * export
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: suncom.EventPriorityEnum, args?: any[]): void {
            MutexLocker.deactive();
            this.$var_controller.registerCommand(name, cls, priority, args);
        }

        /**
         * export
         */
        removeCommand(name: string): void {
            MutexLocker.deactive();
            this.$var_controller.removeCommand(name);
        }

        /**
         * export
         */
        hasCommand(name: string): boolean {
            MutexLocker.deactive();
            return this.$var_controller.hasCommand(name);
        }

        /**
         * export
         */
        registerProxy(proxy: IProxy<any>): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_model.registerProxy(proxy);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        removeProxy(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_model.removeProxy(name);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        retrieveProxy(name: string): IProxy<any> {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const proxy: IProxy<any> = this.$var_model.retrieveProxy(name);
            MutexLocker.deactive();
            return proxy;
        }

        /**
         * export
         */
        hasProxy(name: string): boolean {
            MutexLocker.deactive();
            return this.$var_model.hasProxy(name);
        }

        /**
         * export
         */
        registerMediator(mediator: IMediator<any>): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.registerMediator(mediator);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        removeMediator(name: string): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.removeMediator(name);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        retrieveMediator(name: string): IMediator<any> {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            const mediator: IMediator<any> = this.$var_view.retrieveMediator(name);
            MutexLocker.deactive();
            return mediator;
        }

        /**
         * export
         */
        hasMediator(name: string): boolean {
            MutexLocker.deactive();
            return this.$var_view.hasMediator(name);
        }

        /**
         * export
         */
        sendNotification(name: string, data?: any, cancelable?: boolean): void {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.notifyObservers(name, data, cancelable);
            MutexLocker.deactive();
        }

        /**
         * export
         */
        notifyCancel(): void {
            MutexLocker.deactive();
            this.$var_view.notifyCancel();
        }
    }
}
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
            this.$initializeModel();
            this.$initializeController();
            this.$initializeView();
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
         * export
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, args?: any[]): void {
            this.$var_view.registerObserver(name, method, caller, receiveOnce, priority, args);
        }

        /**
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            this.$var_view.removeObserver(name, method, caller);
        }

        /**
         * export
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean {
            return this.$var_view.hasObserver(name, method, caller);
        }

        /**
         * export
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: suncom.EventPriorityEnum, args?: any[]): void {
            this.$var_controller.registerCommand(name, cls, priority, args);
        }

        /**
         * export
         */
        removeCommand(name: string): void {
            this.$var_controller.removeCommand(name);
        }

        /**
         * export
         */
        hasCommand(name: string): boolean {
            return this.$var_controller.hasCommand(name);
        }

        /**
         * export
         */
        registerProxy(proxy: IProxy<any>): void {
            this.$var_model.registerProxy(proxy);
        }

        /**
         * export
         */
        removeProxy(name: string): void {
            this.$var_model.removeProxy(name);
        }

        /**
         * export
         */
        retrieveProxy(name: string): IProxy<any> {
            return this.$var_model.retrieveProxy(name);
        }

        /**
         * export
         */
        hasProxy(name: string): boolean {
            return this.$var_model.hasProxy(name);
        }

        /**
         * export
         */
        registerMediator(mediator: IMediator<any>): void {
            this.$var_view.registerMediator(mediator);
        }

        /**
         * export
         */
        removeMediator(name: string): void {
            this.$var_view.removeMediator(name);
        }

        /**
         * export
         */
        retrieveMediator(name: string): IMediator<any> {
            return this.$var_view.retrieveMediator(name);
        }

        /**
         * export
         */
        hasMediator(name: string): boolean {
            return this.$var_view.hasMediator(name);
        }

        /**
         * export
         */
        sendNotification(name: string, data?: any, cancelable?: boolean): void {
            this.$var_view.notifyObservers(name, data, cancelable);
        }

        /**
         * export
         */
        notifyCancel(): void {
            this.$var_view.notifyCancel();
        }
    }
}
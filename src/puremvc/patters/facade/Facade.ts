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
                throw Error(`Facade singleton already constructed!`);
            }
            Facade.inst = this;
            this.$initializeFacade();
        }

        private $initializeFacade(): void {
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
         * 注册监听
         * @receiveOnce: 是否为一次性监听，默认为: false
         * @priority: 响应优先级，值越大，优先级越高，默认为: 2
         * @args[]: 回调参数列表，默认为: null
         * 说明：
         * 1. 若需覆盖参数，请先调用removeObserver移除监听后再重新注册
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number, args?: any[]): void {
            this.$view.registerObserver(name, method, caller, receiveOnce, priority, args);
        }

        /**
         * 移除监听
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            this.$view.removeObserver(name, method, caller);
        }

        /**
         * 注册命令
         * @cls: 命令被响应时，会构建cls实例并执行其execute方法
         * @其余参数请参考registerObserver接口
         * 说明：
         * 1. 命令不可重复注册
         * export
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: number, args?: any[]): void {
            this.$controller.registerCommand(name, cls, priority, args);
        }

        /**
         * 移除命令
         * export
         */
        removeCommand(name: string): void {
            this.$controller.removeCommand(name);
        }

        /**
         * 查询是否存在命令
         * export
         */
        hasCommand(name: string): boolean {
            return this.$controller.hasCommand(name);
        }

        /**
         * 注册数据代理类实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         * export
         */
        registerProxy(proxy: Proxy<any>): void {
            this.$model.registerProxy(proxy);
        }

        /**
         * 移除数据代理类实例
         * export
         */
        removeProxy(name: string): void {
            this.$model.removeProxy(name);
        }

        /**
         * 获取数据代理类实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         * export
         */
        retrieveProxy(name: string): Proxy<any> {
            return this.$model.retrieveProxy(name);
        }

        /**
         * 查询是否存在数据代理类实例
         * export
         */
        hasProxy(name: string): boolean {
            return this.$model.hasProxy(name);
        }

        /**
         * 注册视图中介者实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         * export
         */
        registerMediator(mediator: Mediator<any>): void {
            this.$view.registerMediator(mediator);
        }

        /**
         * 移除视图中介者实例
         * export
         */
        removeMediator(name: string): void {
            this.$view.removeMediator(name);
        }

        /**
         * 获取视图中介者实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         * export
         */
        retrieveMediator(name: string): Mediator<any> {
            return this.$view.retrieveMediator(name);
        }

        /**
         * 查询是否存在视图中介者实例
         * export
         */
        hasMediator(name: string): boolean {
            return this.$view.hasMediator(name);
        }

        /**
         * 派发通知
         * @data: 参数对象，允许为任意类型的数据，传递多个参数时可指定其为数组，若需要传递的data本身就是数组，则需要传递[data]
         * @cancelable: 通知是否允许被取消，默认为: true
         */
        sendNotification(name: string, data?: any, cancelable?: boolean): void {
            this.$view.notifyObservers(name, data, cancelable);
        }

        /**
         * 通知取消
         * 说明：
         * 1. 未响应的回调都将不再执行
         * export
         */
        notifyCancel(): void {
            this.$view.notifyCancel();
        }
    }
}
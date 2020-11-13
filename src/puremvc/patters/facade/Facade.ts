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
                throw Error("Facade singleton already constructed!");
            }
            Facade.inst = this;
            this.$initializeFacade();
        }

        private $initializeFacade(): void {
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
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
         * @priority: 优先级，值高的先响应，默认为: 2
         * export
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number, args?: any[]): void {
            this.$view.registerObserver(name, method, caller, receiveOnce, priority, args);
        }

        /**
         * export
         */
        removeObserver(name: string, method: Function, caller: Object): void {
            this.$view.removeObserver(name, method, caller);
        }

        /**
         * export
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: number, args?: any[]): void {
            this.$controller.registerCommand(name, cls, priority, args);
        }

        /**
         * export
         */
        removeCommand(name: string): void {
            this.$controller.removeCommand(name);
        }

        /**
         * export
         */
        hasCommand(name: string): boolean {
            return this.$controller.hasCommand(name);
        }

        /**
         * export
         */
        registerProxy(proxy: Proxy): void {
            this.$model.registerProxy(proxy);
        }

        /**
         * export
         */
        removeProxy(name: string): void {
            this.$model.removeProxy(name);
        }

        /**
         * export
         */
        retrieveProxy(name: string): Proxy {
            return this.$model.retrieveProxy(name);
        }

        /**
         * export
         */
        hasProxy(name: string): boolean {
            return this.$model.hasProxy(name);
        }

        /**
         * export
         */
        registerMediator(mediator: Mediator): void {
            this.$view.registerMediator(mediator);
        }

        /**
         * export
         */
        removeMediator(name: string): void {
            this.$view.removeMediator(name);
        }

        /**
         * export
         */
        retrieveMediator(name: string): Mediator {
            return this.$view.retrieveMediator(name);
        }

        /**
         * export
         */
        hasMediator(name: string): boolean {
            return this.$view.hasMediator(name);
        }

        /**
         * export
         */
        sendNotification(name: string, args?: any, cancelable?: boolean): void {
            this.$view.notifyObservers(name, args, cancelable);
        }

        /**
         * export
         */
        notifyCancel(): void {
            this.$view.notifyCancel();
        }
    }
}
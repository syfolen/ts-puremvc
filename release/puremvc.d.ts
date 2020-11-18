/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
declare module puremvc {

    interface ICommand {

        execute(...args: any[]): void;
    }

    class Facade {

        static inst: Facade;

        static getInstance(): Facade;

        protected $initializeModel(): void;

        protected $initializeView(): void;

        protected $initializeController(): void;

        /**
         * @priority: 优先级，值高的先响应，默认为: 2
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number, args?: any[]): void;

        removeObserver(name: string, method: Function, caller: Object): void;

        registerCommand(name: string, cls: new () => ICommand, priority?: number, args?: any[]): void;

        removeCommand(name: string): void;

        hasCommand(name: string): boolean;

        registerProxy(proxy: Proxy): void;

        removeProxy(name: string): void;

        retrieveProxy(name: string): Proxy;

        hasProxy(name: string): boolean;

        registerMediator(mediator: Mediator): void;

        removeMediator(name: string): void;

        retrieveMediator(name: string): Mediator;

        hasMediator(name: string): boolean;

        sendNotification(name: string, args?: any, cancelable?: boolean): void;

        notifyCancel(): void;
    }

    class Notifier {

        protected readonly facade: Facade;
    }

    class Proxy extends Notifier {
        /**
         * 未初始化时值为：void 0
         */
        protected $data: any;

        constructor(name: string, data?: any);

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        getData(): any;

        setData(data: any): void;
    }

    abstract class SimpleCommand extends Notifier implements ICommand {

        abstract execute(...args: any[]): void;
    }

    abstract class MacroCommand extends Notifier implements ICommand {

        protected abstract $initializeMacroCommand(): void;

        protected $addSubCommand(cls: new () => ICommand): void;

        execute(): void;
    }

    class Mediator extends Notifier {
        /**
         * 未初始化时值为：null
         */
        protected $viewComponent: any;

        constructor(name: string, viewComponent?: any);

        protected $handleNotification(name: string, method: Function, priority?: number, args?: any[]): void;

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        getViewComponent(): any;

        setViewComponent(view: any): void;
    }

}
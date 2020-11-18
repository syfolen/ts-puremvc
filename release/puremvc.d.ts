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
    /**
     * 消息关心的模块ID
     */
    enum CareModuleID {
        /**
         * CUSTOM
         */
        CUSTOM,

        /**
         * TIMELINE
         */
        TIMELINE
    }

    interface ICommand {

        execute(...args: any[]): void;
    }

    /**
     * 注册事件时的可选参数
     */
    interface IOption {
        /**
         * 消息关心的模块，默认：无
         */
        careStatMod?: suncore.ModuleEnum;

        /**
         * 消息响应间隔，最小为：1，默认为：1
         */
        delay?: number;

        /**
         * 参数列表
         */
        args?: any[];
    }

    class Facade {

        static inst: Facade;

        static getInstance(): Facade;

        protected $initMsgQ(): void;

        protected $initializeModel(): void;

        protected $initializeView(): void;

        protected $initializeController(): void;

        /**
         * 为MMI层模块注册命令前缀
         * 说明：
         * 1. 只有通过此方法注册过的MsgQ模块才允许使用模型或视图接口
         */
        protected $regMMICmd(msgQMod: suncore.MsgQModEnum, prefix: string): void;

        /**
         * 注册MsgQ模块的命令前缀
         */
        protected $regMsgQCmd(msgQMod: suncore.MsgQModEnum, prefix: string): void;

        /**
         * 关心模块状态的命令
         */
        protected $setCareStatForCmd(cmd: string): void;

        /**
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1，默认为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): Observer;

        /**
         * 移除观察者
         */
        removeObserver(name: string, method: Function, caller: Object): void;

        /**
         * 查询是否存在观察者
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean;

        /**
         * 注册命令
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1，默认为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): void;

        /**
         * 移除命令
         */
        removeCommand(name: string): void;

        /**
         * 查询是否存在指定命令
         */
        hasCommand(name: string): boolean;

        /**
         * 注册模型代理
         */
        registerProxy(proxy: Proxy): void;

        /**
         * 移除模型代理
         */
        removeProxy(name: string): void;

        /**
         * 获取模型代理
         */
        retrieveProxy(name: string): Proxy;

        /**
         * 查询是否存在指定模型代理
         */
        hasProxy(name: string): boolean;

        /**
         * 注册视图中介者对象
         */
        registerMediator(mediator: Mediator): void;

        /**
         * 移除视图中介者对象
         */
        removeMediator(name: string): void;

        /**
         * 获取视图中介者对象
         */
        retrieveMediator(name: string): Mediator;

        /**
         * 查询是否存在指定视图中介者对象
         */
        hasMediator(name: string): boolean;

        /**
         * 派发命令通知
         * @args: 参数列表，允许为任意类型的数据
         * @cancelable: 通知是否允许取消，默认为：true
         * @force: 强制响应，默认为：false
         * 说明：
         * 1. 有些事件关心模块状态，在模块未激活的情况下，将force设为true可以强制响应这类事件
         */
        sendNotification(name: string, args?: any, cancelable?: boolean, force?: boolean): void;

        /**
         * 取消当前命令的派发
         */
        notifyCancel(): void;
    }

    class Notifier {
        /**
         * 是否己销毁
         */
        protected $destroyed: boolean;

        constructor(msgQMod?: suncore.MsgQModEnum);

        /**
         * 销毁对象
         */
        destroy(): void;

        /**
         * 获取PureMVC外观引用
         */
        protected readonly facade: Facade;

        /**
         * 获取消息派发者MsgQ消息模块标识
         */
        readonly msgQMod: suncore.MsgQModEnum;

        /**
         * 是否己销毁
         */
        readonly destroyed: boolean;
    }

    class Observer {
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

        /**
         * 注册事件回调
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：suncom.EventPriorityEnum.MID
         * @option: 可选参数
         * 1. 为number时表示回调函数的响应间隔延时，最小为：1，默认为：1
         * 2. 为CareModuleID时表示消息所关心的系统模块
         * 3. 为数组时代表执行回调函数时的默认参数
         */
        protected $handleNotification(name: string, method: Function, priority?: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): void;

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

    /**
     * 互斥锁，用于实现模块之间的消息互斥
     */
    namespace MutexLocker {

        /**
         * 备份快照，并锁定target指定的模块
         */
        function backup(target: Object): void;

        /**
         * 恢复快照中的数据（自动从上次备份的快照中获取）
         */
        function restore(): void;
    }

}
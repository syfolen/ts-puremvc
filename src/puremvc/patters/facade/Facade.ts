/**
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
        static getInstance(): Facade {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        }

        private $var_view: View = new View();
        private $var_model: Model = new Model();
        private $var_controller: Controller = new Controller();

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
            const observer: Observer = this.$var_view.registerObserver(name, method, caller, receiveOnce, priority, args);
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
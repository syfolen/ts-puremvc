var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var puremvc;
(function (puremvc) {
    var Controller = (function () {
        function Controller() {
            this.$commands = {};
            if (Controller.inst !== null) {
                throw Error("Controller singleton already constructed!");
            }
            Controller.inst = this;
        }
        Controller.prototype.executeCommand = function (name, args) {
            var cmd = new this.$commands[name]();
            if (args instanceof Array) {
                cmd.execute.apply(cmd, args);
            }
            else {
                cmd.execute.call(cmd, args);
            }
        };
        Controller.prototype.registerCommand = function (name, cls, priority, args) {
            if (this.hasCommand(name) === true) {
                throw Error("Register duplicate command: " + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this, false, priority, args);
        };
        Controller.prototype.removeCommand = function (name) {
            if (this.hasCommand(name) === false) {
                throw Error("Remove non-existent command: " + name);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        };
        Controller.prototype.retrieveCommand = function (name) {
            return this.$commands[name] || null;
        };
        Controller.prototype.hasCommand = function (name) {
            return this.$commands[name] !== void 0;
        };
        Controller.inst = null;
        return Controller;
    }());
    puremvc.Controller = Controller;
    var Facade = (function () {
        function Facade() {
            this.$view = new View();
            this.$model = new Model();
            this.$controller = new Controller();
            if (Facade.inst !== null) {
                throw Error("Facade singleton already constructed!");
            }
            Facade.inst = this;
            this.$initializeFacade();
        }
        Facade.getInstance = function () {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        };
        Facade.prototype.$initializeFacade = function () {
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
        };
        Facade.prototype.$initializeModel = function () {
        };
        Facade.prototype.$initializeView = function () {
        };
        Facade.prototype.$initializeController = function () {
        };
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, args) {
            this.$view.registerObserver(name, method, caller, receiveOnce, priority, args);
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            this.$view.removeObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls, priority, args) {
            this.$controller.registerCommand(name, cls, priority, args);
        };
        Facade.prototype.removeCommand = function (name) {
            this.$controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            return this.$controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            this.$model.registerProxy(proxy);
        };
        Facade.prototype.removeProxy = function (name) {
            this.$model.removeProxy(name);
        };
        Facade.prototype.retrieveProxy = function (name) {
            return this.$model.retrieveProxy(name);
        };
        Facade.prototype.hasProxy = function (name) {
            return this.$model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            this.$view.registerMediator(mediator);
        };
        Facade.prototype.removeMediator = function (name) {
            this.$view.removeMediator(name);
        };
        Facade.prototype.retrieveMediator = function (name) {
            return this.$view.retrieveMediator(name);
        };
        Facade.prototype.hasMediator = function (name) {
            return this.$view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, args, cancelable) {
            this.$view.notifyObservers(name, args, cancelable);
        };
        Facade.prototype.notifyCancel = function () {
            this.$view.notifyCancel();
        };
        Facade.inst = null;
        return Facade;
    }());
    puremvc.Facade = Facade;
    var Model = (function () {
        function Model() {
            this.$proxies = {};
            if (Model.inst !== null) {
                throw Error("Model singleton already constructed!");
            }
            Model.inst = this;
        }
        Model.prototype.registerProxy = function (proxy) {
            var name = proxy.getProxyName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Register invalid proxy");
            }
            if (this.hasProxy(name) === true) {
                throw Error("Register duplicate proxy: " + name);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        };
        Model.prototype.removeProxy = function (name) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Remove invalid proxy");
            }
            if (this.hasProxy(name) === false) {
                throw Error("Remove non-existent proxy: " + name);
            }
            var proxy = this.$proxies[name];
            delete this.$proxies[name];
            proxy.onRemove();
        };
        Model.prototype.retrieveProxy = function (name) {
            return this.$proxies[name] || null;
        };
        Model.prototype.hasProxy = function (name) {
            return this.$proxies[name] !== void 0;
        };
        Model.inst = null;
        return Model;
    }());
    puremvc.Model = Model;
    var Notifier = (function () {
        function Notifier() {
            this.facade = Facade.getInstance();
        }
        return Notifier;
    }());
    puremvc.Notifier = Notifier;
    var Observer = (function () {
        function Observer() {
            this.args = null;
            this.name = null;
            this.caller = null;
            this.method = null;
            this.priority = 0;
            this.receiveOnce = false;
        }
        return Observer;
    }());
    puremvc.Observer = Observer;
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name, data) {
            var _this = _super.call(this) || this;
            _this.$proxyName = null;
            _this.$data = void 0;
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Invalid proxy name: " + name);
            }
            _this.$data = data;
            _this.$proxyName = name;
            return _this;
        }
        Proxy.prototype.getProxyName = function () {
            return this.$proxyName || null;
        };
        Proxy.prototype.onRegister = function () {
        };
        Proxy.prototype.onRemove = function () {
        };
        Proxy.prototype.getData = function () {
            return this.$data;
        };
        Proxy.prototype.setData = function (data) {
            this.$data = data;
        };
        return Proxy;
    }(Notifier));
    puremvc.Proxy = Proxy;
    var SimpleCommand = (function (_super) {
        __extends(SimpleCommand, _super);
        function SimpleCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SimpleCommand;
    }(Notifier));
    puremvc.SimpleCommand = SimpleCommand;
    var View = (function () {
        function View() {
            this.$mediators = {};
            this.$workings = {};
            this.$observers = {};
            this.$isCanceled = false;
            this.$onceObservers = [];
            this.$recycle = [];
            if (View.inst !== null) {
                throw Error("View singleton already constructed!");
            }
            View.inst = this;
        }
        View.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, args) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = 2; }
            if (args === void 0) { args = null; }
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Register invalid observer");
            }
            if (method === void 0 || method === null) {
                throw Error("Register invalid observer method: " + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                observers = this.$observers[name] = [];
            }
            else if (this.$workings[name] === true) {
                this.$workings[name] = false;
                this.$observers[name] = observers = observers.slice();
            }
            var index = -1;
            for (var i = 0; i < observers.length; i++) {
                var observer_1 = observers[i];
                if (observer_1.method === method && observer_1.caller === caller) {
                    observer_1.args = args;
                    var b0 = observer_1.priority === priority;
                    var b1 = observer_1.receiveOnce === receiveOnce;
                    if (b0 === false || b1 === false) {
                        var s0 = b0 === true ? "" : "priority:" + priority;
                        var s1 = b1 === true ? "" : "receiveOnce:" + receiveOnce;
                        var s2 = s0 === "" || s1 === "" ? "" : ", ";
                        console.warn("重复注册事件，个别参数未更新：" + ("" + s0 + s2 + s1));
                    }
                    return null;
                }
                if (index === -1 && observer_1.priority < priority) {
                    index = i;
                }
            }
            var observer = this.$recycle.length > 0 ? this.$recycle.pop() : new Observer();
            observer.args = args;
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.priority = priority;
            observer.receiveOnce = receiveOnce;
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        };
        View.prototype.removeObserver = function (name, method, caller) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Remove invalid observer");
            }
            if (method === void 0 || method === null) {
                throw Error("Remove invalid observer method: " + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            if (this.$workings[name] === true) {
                this.$workings[name] = false;
                this.$observers[name] = observers = observers.slice();
            }
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observers.splice(i, 1);
                    this.$recycle.push(observer);
                    break;
                }
            }
            if (observers.length === 0) {
                delete this.$workings[name];
                delete this.$observers[name];
            }
        };
        View.prototype.notifyCancel = function () {
            this.$isCanceled = true;
        };
        View.prototype.notifyObservers = function (name, args, cancelable) {
            if (cancelable === void 0) { cancelable = true; }
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Notify invalid command");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            this.$workings[name] = true;
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                var params = observer.args === null ? args : observer.args.concat(args);
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, params);
                }
                else if (params instanceof Array) {
                    observer.method.apply(observer.caller, params);
                }
                else {
                    observer.method.call(observer.caller, params);
                }
                if (this.$isCanceled) {
                    if (cancelable === true) {
                        break;
                    }
                    console.error("尝试取消不可被取消的命令：" + name);
                    this.$isCanceled = false;
                }
            }
            this.$isCanceled = isCanceled;
            this.$workings[name] = false;
            while (this.$onceObservers.length > 0) {
                var observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.getMediatorName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Register invalid mediator");
            }
            if (this.hasMediator(name) === true) {
                throw Error("Register duplicate mediator: " + name);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        };
        View.prototype.removeMediator = function (name) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Remove invalid mediator");
            }
            if (this.hasMediator(name) === false) {
                throw Error("Remove non-existent mediator " + name);
            }
            var mediator = this.$mediators[name];
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        };
        View.prototype.retrieveMediator = function (name) {
            return this.$mediators[name] || null;
        };
        View.prototype.hasMediator = function (name) {
            return this.$mediators[name] !== void 0;
        };
        View.inst = null;
        return View;
    }());
    puremvc.View = View;
    var MacroCommand = (function (_super) {
        __extends(MacroCommand, _super);
        function MacroCommand() {
            var _this = _super.call(this) || this;
            _this.$commands = [];
            _this.$initializeMacroCommand();
            return _this;
        }
        MacroCommand.prototype.$addSubCommand = function (cls) {
            this.$commands.push(cls);
        };
        MacroCommand.prototype.execute = function () {
            for (var i = 0; i < this.$commands.length; i++) {
                var cmd = new this.$commands[i]();
                cmd.execute.apply(cmd, arguments);
            }
        };
        return MacroCommand;
    }(Notifier));
    puremvc.MacroCommand = MacroCommand;
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator(name, viewComponent) {
            var _this = _super.call(this) || this;
            _this.$mediatorName = null;
            _this.$notificationInterests = [];
            _this.$viewComponent = null;
            if (isStringNullOrEmpty(name) === true) {
                throw Error("Invalid mediator name: " + name);
            }
            _this.$mediatorName = name;
            _this.$viewComponent = viewComponent || null;
            return _this;
        }
        Mediator.prototype.getMediatorName = function () {
            return this.$mediatorName;
        };
        Mediator.prototype.listNotificationInterests = function () {
        };
        Mediator.prototype.removeNotificationInterests = function () {
            for (var i = 0; i < this.$notificationInterests.length; i++) {
                var observer = this.$notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        Mediator.prototype.$handleNotification = function (name, method, receiveOnce, priority, args) {
            var observer = View.inst.registerObserver(name, method, this, receiveOnce, priority, args);
            observer && this.$notificationInterests.push(observer);
        };
        Mediator.prototype.onRegister = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        Mediator.prototype.getViewComponent = function () {
            return this.$viewComponent;
        };
        Mediator.prototype.setViewComponent = function (view) {
            this.$viewComponent = view || null;
        };
        return Mediator;
    }(Notifier));
    puremvc.Mediator = Mediator;
    function isStringNullOrEmpty(str) {
        return str === void 0 || str === null || str === "";
    }
    puremvc.isStringNullOrEmpty = isStringNullOrEmpty;
})(puremvc || (puremvc = {}));
//# sourceMappingURL=puremvc.js.map